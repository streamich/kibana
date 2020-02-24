/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React from 'react';
import { i18n } from '@kbn/i18n';
import { CoreStart } from 'src/core/public';
import { Action } from '../../../../../../src/plugins/ui_actions/public';
import { toMountPoint } from '../../../../../../src/plugins/kibana_react/public';
import { IEmbeddable } from '../../../../../../src/plugins/embeddable/public';
import { FlyoutCreateDrilldown } from '../../components/flyout_create_drilldown';

export const OPEN_FLYOUT_ADD_DRILLDOWN = 'OPEN_FLYOUT_ADD_DRILLDOWN';

interface ActionContext {
  embeddable: IEmbeddable;
}

export interface OpenFlyoutAddDrilldownParams {
  overlays: () => Promise<CoreStart['overlays']>;
}

export class OpenFlyoutAddDrilldown implements Action<ActionContext> {
  public readonly type = OPEN_FLYOUT_ADD_DRILLDOWN;
  public readonly id = OPEN_FLYOUT_ADD_DRILLDOWN;
  public order = 100;

  constructor(protected readonly params: OpenFlyoutAddDrilldownParams) {}

  public getDisplayName() {
    return i18n.translate('xpack.drilldowns.panel.openFlyoutAddDrilldown.displayName', {
      defaultMessage: 'Add drilldown',
    });
  }

  public getIconType() {
    return 'empty';
  }

  public async isCompatible({ embeddable }: ActionContext) {
    return true;
  }

  public async execute(context: ActionContext) {
    const overlays = await this.params.overlays();
    overlays.openFlyout(toMountPoint(<FlyoutCreateDrilldown />));
  }
}
