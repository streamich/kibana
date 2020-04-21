/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { CoreSetup } from 'src/core/public';
import { SetupDependencies, StartDependencies } from '../../plugin';
import { CONTEXT_MENU_TRIGGER } from '../../../../../../src/plugins/embeddable/public';
import { EnhancedEmbeddableContext } from '../../../../embeddable_enhanced/public';
import {
  FlyoutCreateDrilldownAction,
  FlyoutEditDrilldownAction,
  OPEN_FLYOUT_ADD_DRILLDOWN,
  OPEN_FLYOUT_EDIT_DRILLDOWN,
} from './actions';

import { DashboardToDashboardDrilldown } from './dashboard_to_dashboard_drilldown';
import { DashboardToDiscoverDrilldown } from './dashboard_to_discover_drilldown';
import { DashboardToUrlDrilldown } from './dashboard_to_url_drilldown';
import { createStartServicesGetter } from '../../../../../../src/plugins/kibana_utils/public/';

declare module '../../../../../../src/plugins/ui_actions/public' {
  export interface ActionContextMapping {
    [OPEN_FLYOUT_ADD_DRILLDOWN]: EnhancedEmbeddableContext;
    [OPEN_FLYOUT_EDIT_DRILLDOWN]: EnhancedEmbeddableContext;
  }
}

interface BootstrapParams {
  enableDrilldowns: boolean;
}

export class DashboardDrilldownsService {
  bootstrap(
    core: CoreSetup<StartDependencies>,
    plugins: SetupDependencies,
    { enableDrilldowns }: BootstrapParams
  ) {
    if (enableDrilldowns) {
      this.setupDrilldowns(core, plugins);
    }
  }

  setupDrilldowns(core: CoreSetup<StartDependencies>, plugins: SetupDependencies) {
    const start = createStartServicesGetter<StartDependencies, unknown>(core.getStartServices);

    const overlays = () => start().core.overlays;
    const drilldowns = () => start().plugins.drilldowns;
    const getSavedObjectsClient = () => start().core.savedObjects.client;
    const getApplicationService = () => start().core.application;
    const getGetUrlGenerator = () => start().plugins.share.urlGenerators.getUrlGenerator;
    const getDataPluginActions = () => start().plugins.data.actions;

    const actionFlyoutCreateDrilldown = new FlyoutCreateDrilldownAction({ overlays, drilldowns });
    plugins.uiActions.addTriggerAction(CONTEXT_MENU_TRIGGER, actionFlyoutCreateDrilldown);

    const actionFlyoutEditDrilldown = new FlyoutEditDrilldownAction({ overlays, drilldowns });
    plugins.uiActions.addTriggerAction(CONTEXT_MENU_TRIGGER, actionFlyoutEditDrilldown);

    const dashboardToDashboardDrilldown = new DashboardToDashboardDrilldown({
      getSavedObjectsClient,
      getGetUrlGenerator,
      getApplicationService,
      getDataPluginActions,
    });
    plugins.drilldowns.registerDrilldown(dashboardToDashboardDrilldown);

    const dashboardToDiscoverDrilldown = new DashboardToDiscoverDrilldown({ start });
    plugins.drilldowns.registerDrilldown(dashboardToDiscoverDrilldown);

    const dashboardToUrlDrilldown = new DashboardToUrlDrilldown({ start });
    plugins.drilldowns.registerDrilldown(dashboardToUrlDrilldown);
  }
}
