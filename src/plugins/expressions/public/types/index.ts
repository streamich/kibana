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

import { Adapters } from '../../../inspector/public';
import {
  Executor,
  IInterpreterRenderHandlers,
  ExpressionValue,
  ExecutionContextSearch,
} from '../../common';

/**
 * @deprecated
 *
 * This type if remainder from legacy platform, will be deleted going further.
 */
export interface ExpressionExecutor {
  interpreter: ExpressionInterpreter;
}

/**
 * @deprecated
 */
export interface ExpressionInterpreter {
  interpretAst: Executor['run'];
}

export interface IExpressionLoaderParams {
  searchContext?: ExecutionContextSearch;
  context?: ExpressionValue;
  variables?: Record<string, any>;
  disableCaching?: boolean;
  customFunctions?: [];
  customRenderers?: [];
  extraHandlers?: Record<string, any>;
  inspectorAdapters?: Adapters;
  onRenderError?: RenderErrorHandlerFnType;
}

export interface RenderError extends Error {
  type?: string;
}

export type RenderErrorHandlerFnType = (
  domNode: HTMLElement,
  error: RenderError,
  handlers: IInterpreterRenderHandlers
) => void;
