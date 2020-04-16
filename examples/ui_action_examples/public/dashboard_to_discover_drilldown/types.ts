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

import {
  EmbeddableVisTriggerContext,
  EmbeddableContext,
} from '../../../../src/plugins/embeddable/public';
import { UiActionsCollectConfigProps } from '../../../../src/plugins/ui_actions/public';

export type PlaceContext = EmbeddableContext;
export type ActionContext = EmbeddableVisTriggerContext;

export interface Config {
  /**
   * Whether to use a user selected index pattern, stored in `indexPatternId` field.
   */
  pickIndexPattern: boolean;

  /**
   * ID of index pattern picked by user in UI. If not set, drilldown will use
   * the index pattern of the visualization.
   */
  indexPatternId?: string;

  /**
   * Whether to carry over source dashboard filters and query.
   */
  carryFiltersAndQuery: boolean;

  /**
   * Whether to carry over source dashboard time range.
   */
  carryTimeRange: boolean;
}

export type CollectConfigProps = UiActionsCollectConfigProps<Config>;
