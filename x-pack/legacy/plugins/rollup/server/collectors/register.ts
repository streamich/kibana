/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { get } from 'lodash';
import { UsageCollectionSetup } from 'src/plugins/usage_collection/server';
import { CallCluster } from 'src/legacy/core_plugins/elasticsearch';

interface IdToFlagMap {
  [key: string]: boolean;
}

const ROLLUP_USAGE_TYPE = 'rollups';

// elasticsearch index.max_result_window default value
const ES_MAX_RESULT_WINDOW_DEFAULT_VALUE = 1000;

function getIdFromSavedObjectId(savedObjectId: string) {
  // The saved object ID is formatted `{TYPE}:{ID}`.
  return savedObjectId.split(':')[1];
}

function createIdToFlagMap(ids: string[]) {
  return ids.reduce((map, id) => {
    map[id] = true;
    return map;
  }, {} as any);
}

async function fetchRollupIndexPatterns(kibanaIndex: string, callCluster: CallCluster) {
  const searchParams = {
    size: ES_MAX_RESULT_WINDOW_DEFAULT_VALUE,
    index: kibanaIndex,
    ignoreUnavailable: true,
    filterPath: ['hits.hits._id'],
    body: {
      query: {
        bool: {
          filter: {
            term: {
              'index-pattern.type': 'rollup',
            },
          },
        },
      },
    },
  };

  const esResponse = await callCluster('search', searchParams);

  return get(esResponse, 'hits.hits', []).map(indexPattern => {
    const { _id: savedObjectId } = indexPattern;
    return getIdFromSavedObjectId(savedObjectId);
  });
}

async function fetchRollupSavedSearches(
  kibanaIndex: string,
  callCluster: CallCluster,
  rollupIndexPatternToFlagMap: IdToFlagMap
) {
  const searchParams = {
    size: ES_MAX_RESULT_WINDOW_DEFAULT_VALUE,
    index: kibanaIndex,
    ignoreUnavailable: true,
    filterPath: ['hits.hits._id', 'hits.hits._source.search.kibanaSavedObjectMeta'],
    body: {
      query: {
        bool: {
          filter: {
            term: {
              type: 'search',
            },
          },
        },
      },
    },
  };

  const esResponse = await callCluster('search', searchParams);
  const savedSearches = get(esResponse, 'hits.hits', []);

  // Filter for ones with rollup index patterns.
  return savedSearches.reduce((rollupSavedSearches, savedSearch) => {
    const {
      _id: savedObjectId,
      _source: {
        search: {
          kibanaSavedObjectMeta: { searchSourceJSON },
        },
      },
    } = savedSearch;

    const searchSource = JSON.parse(searchSourceJSON);

    if (rollupIndexPatternToFlagMap[searchSource.index]) {
      const id = getIdFromSavedObjectId(savedObjectId) as string;
      rollupSavedSearches.push(id);
    }

    return rollupSavedSearches;
  }, [] as string[]);
}

async function fetchRollupVisualizations(
  kibanaIndex: string,
  callCluster: CallCluster,
  rollupIndexPatternToFlagMap: IdToFlagMap,
  rollupSavedSearchesToFlagMap: IdToFlagMap
) {
  const searchParams = {
    size: ES_MAX_RESULT_WINDOW_DEFAULT_VALUE,
    index: kibanaIndex,
    ignoreUnavailable: true,
    filterPath: [
      'hits.hits._source.visualization.savedSearchRefName',
      'hits.hits._source.visualization.kibanaSavedObjectMeta',
      'hits.hits._source.references',
    ],
    body: {
      query: {
        bool: {
          filter: {
            term: {
              type: 'visualization',
            },
          },
        },
      },
    },
  };

  const esResponse = await callCluster('search', searchParams);
  const visualizations = get(esResponse, 'hits.hits', []);

  let rollupVisualizations = 0;
  let rollupVisualizationsFromSavedSearches = 0;

  visualizations.forEach(visualization => {
    const {
      _source: {
        visualization: {
          savedSearchRefName,
          kibanaSavedObjectMeta: { searchSourceJSON },
        },
        references = [] as any[],
      },
    } = visualization;

    const searchSource = JSON.parse(searchSourceJSON);

    if (savedSearchRefName) {
      // This visualization depends upon a saved search.
      const savedSearch = references.find(ref => ref.name === savedSearchRefName);
      if (rollupSavedSearchesToFlagMap[savedSearch.id]) {
        rollupVisualizations++;
        rollupVisualizationsFromSavedSearches++;
      }
    } else {
      // This visualization depends upon an index pattern.
      if (rollupIndexPatternToFlagMap[searchSource.index]) {
        rollupVisualizations++;
      }
    }

    return rollupVisualizations;
  });

  return {
    rollupVisualizations,
    rollupVisualizationsFromSavedSearches,
  };
}

export function registerRollupUsageCollector(
  usageCollection: UsageCollectionSetup,
  kibanaIndex: string
): void {
  const collector = usageCollection.makeUsageCollector({
    type: ROLLUP_USAGE_TYPE,
    isReady: () => true,
    fetch: async (callCluster: CallCluster) => {
      const rollupIndexPatterns = await fetchRollupIndexPatterns(kibanaIndex, callCluster);
      const rollupIndexPatternToFlagMap = createIdToFlagMap(rollupIndexPatterns);

      const rollupSavedSearches = await fetchRollupSavedSearches(
        kibanaIndex,
        callCluster,
        rollupIndexPatternToFlagMap
      );
      const rollupSavedSearchesToFlagMap = createIdToFlagMap(rollupSavedSearches);

      const {
        rollupVisualizations,
        rollupVisualizationsFromSavedSearches,
      } = await fetchRollupVisualizations(
        kibanaIndex,
        callCluster,
        rollupIndexPatternToFlagMap,
        rollupSavedSearchesToFlagMap
      );

      return {
        index_patterns: {
          total: rollupIndexPatterns.length,
        },
        saved_searches: {
          total: rollupSavedSearches.length,
        },
        visualizations: {
          total: rollupVisualizations,
          saved_searches: {
            total: rollupVisualizationsFromSavedSearches,
          },
        },
      };
    },
  });

  usageCollection.registerCollector(collector);
}
