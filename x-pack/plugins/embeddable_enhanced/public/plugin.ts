/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { CoreStart, CoreSetup, Plugin, PluginInitializerContext } from 'src/core/public';
import { SavedObjectAttributes } from 'kibana/public';
import { UiActionsSetup, UiActionsStart } from '../../../../src/plugins/ui_actions/public';
import {
  EmbeddableFactory,
  EmbeddableFactoryDefinition,
  EmbeddableInput,
  EmbeddableOutput,
  EmbeddableSetup,
  EmbeddableStart,
  IEmbeddable,
  defaultEmbeddableFactoryProvider,
} from '../../../../src/plugins/embeddable/public';

export interface SetupDependencies {
  embeddable: EmbeddableSetup;
  uiActions: UiActionsSetup;
}

export interface StartDependencies {
  embeddable: EmbeddableStart;
  uiActions: UiActionsStart;
}

// eslint-disable-next-line
export interface SetupContract {}

// eslint-disable-next-line
export interface StartContract {}

export class EmbeddableEnhancedPlugin
  implements Plugin<SetupContract, StartContract, SetupDependencies, StartDependencies> {
  constructor(protected readonly context: PluginInitializerContext) {}

  public setup(core: CoreSetup<StartDependencies>, plugins: SetupDependencies): SetupContract {
    plugins.embeddable.setCustomEmbeddableFactoryProvider(
      <
        I extends EmbeddableInput = EmbeddableInput,
        O extends EmbeddableOutput = EmbeddableOutput,
        E extends IEmbeddable<I, O> = IEmbeddable<I, O>,
        T extends SavedObjectAttributes = SavedObjectAttributes
      >(
        def: EmbeddableFactoryDefinition<I, O, E, T>
      ): EmbeddableFactory<I, O, E, T> => {
        const factory: EmbeddableFactory<I, O, E, T> = defaultEmbeddableFactoryProvider<I, O, E, T>(
          def
        );
        return {
          ...factory,
          create: async (...args) => {
            const embeddable = await factory.create(...args);
            return embeddable;
          },
          createFromSavedObject: async (...args) => {
            const embeddable = await factory.createFromSavedObject(...args);
            return embeddable;
          },
        };
      }
    );

    return {};
  }

  public start(core: CoreStart, plugins: StartDependencies): StartContract {
    return {};
  }

  public stop() {}
}
