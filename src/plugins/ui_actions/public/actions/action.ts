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

import { UiComponent } from 'src/plugins/kibana_utils/common';

/**
 * A convenience interface used to register actions.
 */
export interface Action<Context extends {} = {}, Return = Promise<void>> {
  /**
   * Determined the order when there is more than one action matched to a trigger.
   * Higher numbers are displayed first.
   */
  readonly order?: number;

  /**
   * ID of the action that uniquely identifies this action in the actions registry.
   */
  readonly id: string;

  readonly type: string;

  /**
   * Optional EUI icon type that can be displayed along with the title.
   */
  getIconType(context: Context): string | undefined;

  /**
   * Returns a title to be displayed to the user.
   * @param context
   */
  getDisplayName(context: Context): string;

  /**
   * `UiComponent` to render when displaying this action as a context menu item.
   * If not provided, `getDisplayName` will be used instead.
   */
  readonly MenuItem?: UiComponent<{ context: Context }>;

  /**
   * Returns a promise that resolves to true if this action is compatible given the context,
   * otherwise resolves to false.
   */
  isCompatible(context: Context): Promise<boolean>;

  /**
   * If this returns something truthy, this is used in addition to the `execute` method when clicked.
   */
  getHref?(context: Context): string | undefined;

  /**
   * Executes the action.
   */
  execute(context: Context): Return;
}

export interface SerializedDynamicAction<Config extends object = object> {
  readonly factoryId: string;
  readonly id: string;
  readonly type: string;
  readonly order?: number;
  readonly config: Config;
}
