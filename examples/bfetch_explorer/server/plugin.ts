/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { Plugin, CoreSetup, CoreStart } from '../../../src/core/server';
import { BfetchServerSetup, BfetchServerStart } from '../../../src/plugins/bfetch/server';

export interface BfetchExplorerSetupPlugins {
  bfetch: BfetchServerSetup;
}

export interface BfetchExplorerStartPlugins {
  bfetch: BfetchServerStart;
}

export class BfetchExplorerPlugin implements Plugin {
  public setup(core: CoreSetup, plugins: BfetchExplorerSetupPlugins) {
    plugins.bfetch.addBatchProcessingRoute<{ num: number }, { num: number }>(
      '/bfetch_explorer/double',
      () => ({
        onBatchItem: async ({ num }) => {
          // Wait number of specified milliseconds.
          await new Promise(r => setTimeout(r, num));
          // Double the number and send it back.
          return { num: 2 * num };
        },
      })
    );
  }

  public start(core: CoreStart, plugins: BfetchExplorerStartPlugins) {}

  public stop() {}
}
