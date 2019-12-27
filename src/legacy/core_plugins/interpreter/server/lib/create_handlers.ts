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

import { Legacy } from '../../../../../../kibana';

export const createHandlers = (request: Legacy.Request, server: Legacy.Server) => {
  const { callWithRequest } = server.plugins.elasticsearch.getCluster('data');
  const config = server.config();

  /*
  { environment: 'server',
  serverUri: 'http://localhost:5603/gzu',
  elasticsearchClient: [AsyncFunction: elasticsearchClient] }
  */

  return {
    environment: 'server',
    serverUri:
      config.has('server.rewriteBasePath') && config.get('server.rewriteBasePath')
        ? `${server.info.uri}${config.get('server.basePath')}`
        : server.info.uri,
    elasticsearchClient: async (...args: any) => callWithRequest(request, ...args),
  };
};
