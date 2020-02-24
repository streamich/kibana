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

import React, { useMemo } from 'react';
import {
  ExpressionValueRender,
  ExpressionRendererRegistry,
  ExpressionRenderer,
} from '../../../common';
import { ReactExpressionValue, ReactExpressionValueProps } from '../react_expression_value';

export interface ReactExpressionOutputProps
  extends Pick<ReactExpressionValueProps, 'onMount' | 'onEvent'> {
  output: ExpressionValueRender<unknown>;
  renderers: ExpressionRendererRegistry;
}

export const ReactExpressionOutput: React.FC<ReactExpressionOutputProps> = ({
  output,
  renderers,
  ...rest
}) => {
  const renderer = useMemo<ExpressionRenderer | null>(() => {
    return renderers.get(output.as);
  }, [output.as, renderers]);

  if (!renderer) {
    return <div>Error...</div>;
  }

  return <ReactExpressionValue {...rest} renderer={renderer} value={output.value} />;
};
