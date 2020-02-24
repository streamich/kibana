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

import React from 'react';
import { AnyActionInternal } from '../../actions';
import { ErrorConfigureAction } from '../error_configure_action';
import { txtMissingCollectConfig } from './i18n';

export interface ConfigureActionProps {
  action: AnyActionInternal;
}

export const ConfigureAction: React.FC<ConfigureActionProps> = ({ action }) => {
  if (!action.ReactCollectConfig) {
    return <ErrorConfigureAction action={action} msg={txtMissingCollectConfig} />;
  }

  return (
    <div>
      <div>
        ID: <code>{action.id}</code>
      </div>
    </div>
  );
};
