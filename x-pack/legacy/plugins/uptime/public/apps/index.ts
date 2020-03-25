/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { npSetup } from 'ui/new_platform';
import { Plugin } from './plugin';
import 'uiExports/embeddableFactories';

const plugin = new Plugin({
  opaqueId: Symbol('uptime'),
  env: {} as any,
  config: { get: () => ({} as any) },
});
plugin.setup(npSetup);
