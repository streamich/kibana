/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { CoreSetup, CoreStart, Plugin, PluginInitializerContext } from 'kibana/server';
import { UsageCollectionSetup } from 'src/plugins/usage_collection/server';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Config } from '../common';

interface SetupDependencies {
  usageCollection?: UsageCollectionSetup;
}

interface StartDependencies {
  usageCollection?: unknown;
}

export class DiscoverEnhancedPlugin
  implements Plugin<void, void, SetupDependencies, StartDependencies> {
  private config$: Observable<Config>;

  constructor(protected readonly context: PluginInitializerContext) {
    this.config$ = context.config.create<Config>();
  }

  public setup(core: CoreSetup, { usageCollection }: SetupDependencies) {
    if (!!usageCollection) {
      usageCollection.makeUsageCollector<{
        exploreDataInChartActionEnabled: boolean;
      }>({
        type: 'discoverEnhanced',
        schema: {
          exploreDataInChartActionEnabled: {
            type: 'boolean',
          },
        },
        isReady: () => true,
        fetch: async () => {
          const config = await this.config$.pipe(take(1)).toPromise();
          return {
            exploreDataInChartActionEnabled: config.actions.exploreDataInChart.enabled,
          };
        },
      });
    }
  }

  public start(core: CoreStart) {}
}
