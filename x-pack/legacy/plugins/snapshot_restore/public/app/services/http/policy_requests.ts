/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import { API_BASE_PATH } from '../../../../common/constants';
import { SlmPolicy } from '../../../../common/types';
import { UIM_POLICY_EXECUTE, UIM_POLICY_DELETE, UIM_POLICY_DELETE_MANY } from '../../constants';
import { uiMetricService } from '../ui_metric';
import { httpService } from './http';
import { useRequest, sendRequest } from './use_request';

export const useLoadPolicies = () => {
  return useRequest({
    path: httpService.addBasePath(`${API_BASE_PATH}policies`),
    method: 'get',
  });
};

export const useLoadPolicy = (name: SlmPolicy['name']) => {
  return useRequest({
    path: httpService.addBasePath(`${API_BASE_PATH}policy/${encodeURIComponent(name)}`),
    method: 'get',
  });
};

export const executePolicy = async (name: SlmPolicy['name']) => {
  const result = sendRequest({
    path: httpService.addBasePath(`${API_BASE_PATH}policy/${encodeURIComponent(name)}/run`),
    method: 'post',
  });

  const { trackUiMetric } = uiMetricService;
  trackUiMetric(UIM_POLICY_EXECUTE);
  return result;
};

export const deletePolicies = async (names: Array<SlmPolicy['name']>) => {
  const result = sendRequest({
    path: httpService.addBasePath(
      `${API_BASE_PATH}policies/${names.map(name => encodeURIComponent(name)).join(',')}`
    ),
    method: 'delete',
  });

  const { trackUiMetric } = uiMetricService;
  trackUiMetric(names.length > 1 ? UIM_POLICY_DELETE_MANY : UIM_POLICY_DELETE);
  return result;
};
