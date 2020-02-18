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

import { ExpressionValue } from '../expression_types';

export type ExpressionAstNode =
  | ExpressionAstExpression
  | ExpressionAstFunction
  | ExpressionAstArgument;

export interface ExpressionAstExpression {
  type: 'expression';
  chain: ExpressionAstFunction[];
}

export interface ExpressionAstFunction {
  type: 'function';
  function: string;
  arguments: Record<string, ExpressionAstArgument[]>;

  /**
   * Debug information added to each function when expression is executed in *debug mode*.
   */
  debug?: ExpressionAstFunctionDebug;
}

export interface ExpressionAstFunctionDebug {
  input?: ExpressionValue;
  output?: ExpressionValue;
  duration?: number;
  args?: any;
}

export type ExpressionAstArgument = string | boolean | number | ExpressionAstExpression;
