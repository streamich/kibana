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

import React, { useRef, useLayoutEffect } from 'react';
import { ExpressionRenderer, ExpressionValueRender } from '../../../common';

const noop = () => {};

export interface ReactExpressionValueProps {
  renderer: ExpressionRenderer;
  value: ExpressionValueRender<unknown>['value'];
  onMount?: () => void;
  onEvent?: () => void;
}

export const ReactExpressionValue: React.FC<ReactExpressionValueProps> = ({
  renderer,
  value,
  onMount = noop,
  onEvent = noop,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const destroyFn = useRef<() => void>(noop);

  /* eslint-disable react-hooks/exhaustive-deps */
  useLayoutEffect(() => {
    if (!ref.current) return;
    renderer.render(ref.current, value, {
      done: onMount,
      event: onEvent,
      onDestroy: (fn: () => void) => {
        (destroyFn as any).current = fn;
      },
      reload: noop,
      update: noop,
    });
    return () => {
      destroyFn.current();
      destroyFn.current = noop;
    };
  }, [renderer, value]);
  /* eslint-enable react-hooks/exhaustive-deps */

  return <div ref={ref} />;
};
