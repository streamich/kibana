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

import { Action, ActionContext as Context, ActionDefinition } from './action';
import { Presentable, PresentableGrouping } from '../util/presentable';
import { uiToReactComponent } from '../../../kibana_react/public';
import { ActionType } from '../types';
import { UiActionsTelemetryService } from '../service/ui_actions_telemetry';

export interface ActionInternalParams {
  telemetry: UiActionsTelemetryService;
}

/**
 * @internal
 */
export class ActionInternal<A extends ActionDefinition = ActionDefinition>
  implements Action<Context<A>>, Presentable<Context<A>> {
  constructor(public readonly definition: A, protected readonly params: ActionInternalParams) {}

  public readonly id: string = this.definition.id;
  public readonly type: ActionType = this.definition.type || '';
  public readonly order: number = this.definition.order || 0;
  public readonly MenuItem? = this.definition.MenuItem;
  public readonly ReactMenuItem? = this.MenuItem ? uiToReactComponent(this.MenuItem) : undefined;
  public readonly grouping?: PresentableGrouping<Context<A>> = this.definition.grouping;

  public execute(context: Context<A>) {
    this.params.telemetry.reportActionExecuted(this);
    return this.definition.execute(context);
  }

  public getIconType(context: Context<A>): string | undefined {
    if (!this.definition.getIconType) return undefined;
    return this.definition.getIconType(context);
  }

  public getDisplayName(context: Context<A>): string {
    if (!this.definition.getDisplayName) return `Action: ${this.id}`;
    return this.definition.getDisplayName(context);
  }

  public getDisplayNameTooltip(context: Context<A>): string {
    if (!this.definition.getDisplayNameTooltip) return '';
    return this.definition.getDisplayNameTooltip(context);
  }

  public async isCompatible(context: Context<A>): Promise<boolean> {
    if (!this.definition.isCompatible) return true;
    return await this.definition.isCompatible(context);
  }

  public async getHref(context: Context<A>): Promise<string | undefined> {
    if (!this.definition.getHref) return undefined;
    return await this.definition.getHref(context);
  }

  public async shouldAutoExecute(context: Context<A>): Promise<boolean> {
    if (!this.definition.shouldAutoExecute) return false;
    return this.definition.shouldAutoExecute(context);
  }
}
