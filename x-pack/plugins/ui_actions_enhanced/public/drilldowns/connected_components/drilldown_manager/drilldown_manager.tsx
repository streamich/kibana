/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import * as React from 'react';
import { useDrilldownManager } from '../context';

export const DrilldownManager: React.FC = ({}) => {
  const manager = useDrilldownManager();

  return <div>This is drilldown manager...{manager.drilldownName}</div>;
};
