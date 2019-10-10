/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { CoreSetup } from 'src/core/public';
// The following dependencies on ui/* and src/legacy/core_plugins must be mocked when testing
import chrome, { Chrome } from 'ui/chrome';
import { Storage } from 'ui/storage';
import { npSetup, npStart } from 'ui/new_platform';
import { getIndexPatternDatasource } from './indexpattern';
import { renameColumns } from './rename_columns';
import { calculateFilterRatio } from './filter_ratio';
import { ExpressionsSetup } from '../../../../../../src/plugins/expressions/public';

// TODO these are intermediary types because interpreter is not typed yet
// They can get replaced by references to the real interfaces as soon as they
// are available

export interface IndexPatternDatasourceSetupPlugins {
  chrome: Chrome;
  expressions: ExpressionsSetup;
}

class IndexPatternDatasourcePlugin {
  constructor() {}

  setup(core: CoreSetup, { expressions }: IndexPatternDatasourceSetupPlugins) {
    expressions.registerFunction(renameColumns);
    expressions.registerFunction(calculateFilterRatio);
  }

  stop() {}
}

const plugin = new IndexPatternDatasourcePlugin();

export const indexPatternDatasourceSetup = () => {
  plugin.setup(npSetup.core, {
    chrome,
    expressions: npSetup.plugins.expressions,
  });

  return getIndexPatternDatasource({
    core: npStart.core,
    chrome,
    storage: new Storage(localStorage),
    savedObjectsClient: chrome.getSavedObjectsClient(),
  });
};
export const indexPatternDatasourceStop = () => plugin.stop();
