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

import { TriggerRegistry, ActionRegistry } from '../types';
import { Action } from '../actions';
import { Trigger } from '../triggers/trigger';
import { buildContextMenuForActions, openContextMenu } from '../context_menu';

export interface UiActionsServiceParams {
  readonly triggers?: TriggerRegistry;
  readonly actions?: ActionRegistry;
}

export class UiActionsService {
  protected readonly triggers: TriggerRegistry;
  protected readonly actions: ActionRegistry;

  constructor({ triggers = new Map(), actions = new Map() }: UiActionsServiceParams = {}) {
    this.triggers = triggers;
    this.actions = actions;
  }

  public readonly registerTrigger = (trigger: Trigger) => {
    if (this.triggers.has(trigger.id)) {
      throw new Error(`Trigger [trigger.id = ${trigger.id}] already registered.`);
    }

    this.triggers.set(trigger.id, trigger);
  };

  public readonly getTrigger = (id: string) => {
    const trigger = this.triggers.get(id);

    if (!trigger) {
      throw new Error(`Trigger [triggerId = ${id}] does not exist.`);
    }

    return trigger;
  };

  public readonly registerAction = (action: Action) => {
    if (this.actions.has(action.id)) {
      throw new Error(`Action [action.id = ${action.id}] already registered.`);
    }

    this.actions.set(action.id, action);
  };

  public readonly attachAction = (triggerId: string, actionId: string): void => {
    const trigger = this.triggers.get(triggerId);

    if (!trigger) {
      throw new Error(
        `No trigger [triggerId = ${triggerId}] exists, for attaching action [actionId = ${actionId}].`
      );
    }

    if (!trigger.actionIds.find(id => id === actionId)) {
      trigger.actionIds.push(actionId);
    }
  };

  public readonly detachAction = (triggerId: string, actionId: string) => {
    const trigger = this.triggers.get(triggerId);

    if (!trigger) {
      throw new Error(
        `No trigger [triggerId = ${triggerId}] exists, for detaching action [actionId = ${actionId}].`
      );
    }

    trigger.actionIds = trigger.actionIds.filter(id => id !== actionId);
  };

  public readonly getTriggerActions = (triggerId: string) => {
    const trigger = this.getTrigger!(triggerId);
    return trigger.actionIds
      .map(actionId => this.actions.get(actionId))
      .filter(Boolean) as Action[];
  };

  public readonly getTriggerCompatibleActions = async <C>(triggerId: string, context: C) => {
    const actions = this.getTriggerActions!(triggerId);
    const isCompatibles = await Promise.all(actions.map(action => action.isCompatible(context)));
    return actions.reduce<Action[]>(
      (acc, action, i) => (isCompatibles[i] ? [...acc, action] : acc),
      []
    );
  };

  private async executeSingleAction<A extends {} = {}>(action: Action<A>, actionContext: A) {
    const href = action.getHref && action.getHref(actionContext);

    if (href) {
      window.location.href = href;
      return;
    }

    await action.execute(actionContext);
  }

  private async executeMultipleActions<C>(actions: Action[], actionContext: C) {
    const panel = await buildContextMenuForActions({
      actions,
      actionContext,
      closeMenu: () => session.close(),
    });
    const session = openContextMenu([panel]);
  }

  public readonly executeTriggerActions = async <C>(triggerId: string, actionContext: C) => {
    const actions = await this.getTriggerCompatibleActions!(triggerId, actionContext);

    if (!actions.length) {
      throw new Error(
        `No compatible actions found to execute for trigger [triggerId = ${triggerId}].`
      );
    }

    if (actions.length === 1) {
      await this.executeSingleAction(actions[0], actionContext);
      return;
    }

    await this.executeMultipleActions(actions, actionContext);
  };

  /**
   * Removes all registered triggers and actions.
   */
  public readonly clear = () => {
    this.actions.clear();
    this.triggers.clear();
  };

  /**
   * "Fork" a separate instance of `UiActionsService` that inherits all existing
   * triggers and actions, but going forward all new triggers and actions added
   * to this instance of `UiActionsService` are only available within this instance.
   */
  public readonly fork = (): UiActionsService => {
    const triggers: TriggerRegistry = new Map();
    const actions: ActionRegistry = new Map();

    for (const [key, value] of this.triggers.entries()) triggers.set(key, value);
    for (const [key, value] of this.actions.entries()) actions.set(key, value);

    return new UiActionsService({ triggers, actions });
  };
}
