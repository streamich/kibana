/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React from 'react';
import { reactToUiComponent } from '../../../../../../../src/plugins/kibana_react/public';
import { DrilldownDefinition as Drilldown } from '../../../../../drilldowns/public';
import { StartServicesGetter } from '../../../../../../../src/plugins/kibana_utils/public';
import {
  EmbeddableContext,
  EmbeddableVisTriggerContext,
  IEmbeddable,
} from '../../../../../../../src/plugins/embeddable/public';
import { UiActionsCollectConfigProps } from '../../../../../../../src/plugins/ui_actions/public';
import { StartDependencies } from '../../../plugin';
import { CollectConfigContainer } from './collect_config';

export type PlaceContext = EmbeddableContext;
export type ActionContext<T extends IEmbeddable = IEmbeddable> = EmbeddableVisTriggerContext<T>;

export interface Config {
  /**
   * Whether to use a user selected index pattern, stored in `indexPatternId` field.
   */
  customIndexPattern: boolean;

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

const DASHBOARD_TO_DISCOVER_DRILLDOWN = 'DASHBOARD_TO_DISCOVER_DRILLDOWN';

const isOutputWithIndexPatterns = (
  output: unknown
): output is { indexPatterns: Array<{ id: string }> } => {
  if (!output || typeof output !== 'object') return false;
  return Array.isArray((output as any).indexPatterns);
};

export interface Params {
  start: StartServicesGetter<Pick<StartDependencies, 'data'>>;
}

export class DashboardToDiscoverDrilldown
  implements Drilldown<Config, PlaceContext, ActionContext> {
  constructor(protected readonly params: Params) {}

  public readonly id = DASHBOARD_TO_DISCOVER_DRILLDOWN;

  public readonly order = 50;

  public readonly getDisplayName = () => 'Go to Discover';

  public readonly euiIcon = 'discoverApp';

  private readonly ReactCollectConfig: React.FC<CollectConfigProps> = props => (
    <CollectConfigContainer {...props} params={this.params} />
  );

  public readonly CollectConfig = reactToUiComponent(this.ReactCollectConfig);

  public readonly createConfig = () => ({
    customIndexPattern: false,
    carryFiltersAndQuery: true,
    carryTimeRange: true,
  });

  public readonly isConfigValid = (config: Config): config is Config => {
    if (config.customIndexPattern && !config.indexPatternId) return false;
    return true;
  };

  public readonly execute = async (config: Config, context: ActionContext) => {
    let indexPatternId =
      !!config.customIndexPattern && !!config.indexPatternId ? config.indexPatternId : '';

    if (!indexPatternId && !!context.embeddable) {
      const output = context.embeddable!.getOutput();
      if (isOutputWithIndexPatterns(output) && output.indexPatterns.length > 0) {
        indexPatternId = output.indexPatterns[0].id;
      }
    }

    const index = indexPatternId ? `,index:'${indexPatternId}'` : '';
    const path = `#/discover?_g=(filters:!(),refreshInterval:(pause:!f,value:900000),time:(from:now-7d,to:now))&_a=(columns:!(_source),filters:!()${index},interval:auto,query:(language:kuery,query:''),sort:!())`;

    await this.params.start().core.application.navigateToApp('kibana', {
      path,
    });
  };
}
