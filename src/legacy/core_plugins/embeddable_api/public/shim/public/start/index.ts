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

import { EmbeddableStartApiPure } from './types';
import { executeTriggerActions } from './execute_trigger_actions';
import { getEmbeddableFactories } from './get_embeddable_factories';
import { getTrigger } from './get_trigger';
import { getTriggerActions } from './get_trigger_actions';
import { getTriggerCompatibleActions } from './get_trigger_compatible_actions';

export * from './types';
export const pureStartApi: EmbeddableStartApiPure = {
  executeTriggerActions,
  getEmbeddableFactories,
  getTrigger,
  getTriggerActions,
  getTriggerCompatibleActions,
};
