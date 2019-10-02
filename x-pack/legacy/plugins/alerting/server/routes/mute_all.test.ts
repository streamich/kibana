/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { createMockServer } from './_mock_server';
import { muteAllAlertRoute } from './mute_all';

const { server, alertsClient } = createMockServer();
muteAllAlertRoute(server);

test('mutes an alert', async () => {
  const request = {
    method: 'POST',
    url: '/api/alert/1/_mute_all',
  };

  const { statusCode } = await server.inject(request);
  expect(statusCode).toBe(204);
  expect(alertsClient.muteAll).toHaveBeenCalledWith({ id: '1' });
});
