/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React from 'react';
import { TagsManagementServices } from '../../services';
import { LandingPage } from '../landing_page';

export interface Props {
  services: TagsManagementServices;
}

export const TagsManagementSection: React.FC<Props> = ({ services }) => {
  return (
    <div data-test-subj="TagsManagementSection">
      <LandingPage />
    </div>
  );
};
