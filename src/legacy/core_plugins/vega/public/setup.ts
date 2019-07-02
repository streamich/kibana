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

// @ts-ignore
import { once } from 'lodash';
import { npSetup } from 'ui/new_platform';
import { functionsRegistry } from 'plugins/interpreter/registries';
import { visualizations } from '../../visualizations/public';
import { Plugin } from './plugin';
import { data } from '../../data/public/setup';

// @ts-ignore
import { setupModule as setupVegaLegacyModule } from './vega_legacy_module';

const core = {
  ...npSetup.core,
};
const plugins = {
  data: {
    ...data,
    expressions: {
      registerFunction: (fn: any) => functionsRegistry.register(fn),
    },
  },
  vega: {
    loadLegacyDirectives: once(setupVegaLegacyModule),
  },
  visualizations,
};

new Plugin().setup(core, plugins);
