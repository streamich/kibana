/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';
import { EuiFlexGroup, EuiFlexItem } from '@elastic/eui';
import { LayerControl } from './layer_control';
import { ViewControl } from './view_control';
import { AttributionControl } from './attribution_control';

export function WidgetOverlay({ settings }) {
  return (
    <EuiFlexGroup
      className="mapWidgetOverlay"
      responsive={false}
      direction="column"
      alignItems="flexEnd"
      gutterSize="s"
    >
      <EuiFlexItem className="mapWidgetOverlay__layerWrapper">
        {!settings.hideLayerControl && <LayerControl />}
      </EuiFlexItem>
      <EuiFlexItem grow={false}>{!settings.hideViewControl && <ViewControl />}</EuiFlexItem>
      <EuiFlexItem grow={false}>
        <AttributionControl />
      </EuiFlexItem>
    </EuiFlexGroup>
  );
}
