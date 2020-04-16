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

import { Plugin, CoreSetup, CoreStart } from '../../../src/core/public';
import { UiActionsSetup, UiActionsStart } from '../../../src/plugins/ui_actions/public';
import { DataPublicPluginSetup, DataPublicPluginStart } from '../../../src/plugins/data/public';
import { DrilldownsSetup, DrilldownsStart } from '../../../x-pack/plugins/drilldowns/public';
import { createHelloWorldAction, ACTION_HELLO_WORLD } from './hello_world_action';
import { helloWorldTrigger, HELLO_WORLD_TRIGGER_ID } from './hello_world_trigger';
import { DashboardToDiscoverDrilldown } from './dashboard_to_discover_drilldown';
import { createStartServicesGetter } from '../../../src/plugins/kibana_utils/public';

export interface UiActionExamplesSetupDependencies {
  data: DataPublicPluginSetup;
  drilldowns: DrilldownsSetup;
  uiActions: UiActionsSetup;
}

export interface UiActionExamplesStartDependencies {
  data: DataPublicPluginStart;
  drilldowns: DrilldownsStart;
  uiActions: UiActionsStart;
}

declare module '../../../src/plugins/ui_actions/public' {
  export interface TriggerContextMapping {
    [HELLO_WORLD_TRIGGER_ID]: {};
  }

  export interface ActionContextMapping {
    [ACTION_HELLO_WORLD]: {};
  }
}

export class UiActionExamplesPlugin
  implements
    Plugin<void, void, UiActionExamplesSetupDependencies, UiActionExamplesStartDependencies> {
  public setup(core: CoreSetup, { uiActions, drilldowns }: UiActionExamplesSetupDependencies) {
    const start = createStartServicesGetter(core.getStartServices);

    uiActions.registerTrigger(helloWorldTrigger);

    const helloWorldAction = createHelloWorldAction(async () => ({
      openModal: (await core.getStartServices())[0].overlays.openModal,
    }));

    uiActions.registerAction(helloWorldAction);
    uiActions.addTriggerAction(helloWorldTrigger.id, helloWorldAction);

    drilldowns.registerDrilldown(new DashboardToDiscoverDrilldown({ start }));
  }

  public start(core: CoreStart, plugins: UiActionExamplesStartDependencies) {}

  public stop() {}
}
