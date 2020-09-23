/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React from 'react';
import {
  EuiText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiButton,
  EuiSpacer,
  EuiFlyout,
  EuiPopover,
  EuiContextMenu,
  EuiContextMenuPanelDescriptor,
} from '@elastic/eui';
import { Section } from '../../components/section/section';
import { useUiActions } from '../../context';
import { SAMPLE_ML_JOB_CLICK_TRIGGER, SampleMlJob, SampleMlJobClickContext } from '../../triggers';

export const job: SampleMlJob = {
  job_id: '123',
  job_type: 'anomaly_detector',
  description: 'This is some ML job.',
};

export const context: SampleMlJobClickContext = { job };

export const DrilldownsManager: React.FC = () => {
  const { plugins, manager } = useUiActions();
  const [showManager, setShowManager] = React.useState(false);
  const [openPopup, setOpenPopup] = React.useState(false);
  const viewRef = React.useRef<'create' | 'manage'>('create');

  const panels: EuiContextMenuPanelDescriptor[] = [
    {
      id: 0,
      items: [
        {
          name: 'Create new view',
          icon: 'plusInCircle',
          onClick: () => {
            setOpenPopup(false);
            viewRef.current = 'create';
            setShowManager((x) => !x);
          },
        },
        {
          name: 'Drilldown list view',
          icon: 'list',
          onClick: () => {
            setOpenPopup(false);
            viewRef.current = 'manage';
            setShowManager((x) => !x);
          },
        },
      ],
    },
  ];

  const openManagerButton = showManager ? (
    <EuiButton onClick={() => setShowManager(false)}>Close</EuiButton>
  ) : (
    <EuiPopover
      id="contextMenuExample"
      button={
        <EuiButton
          fill={!showManager}
          iconType="arrowDown"
          iconSide="right"
          onClick={() => setOpenPopup((x) => !x)}
        >
          Open Drilldown Manager
        </EuiButton>
      }
      isOpen={openPopup}
      closePopover={() => setOpenPopup(false)}
      panelPaddingSize="none"
      withTitle
      anchorPosition="downLeft"
    >
      <EuiContextMenu initialPanelId={0} panels={panels} />
    </EuiPopover>
  );

  return (
    <div>
      <Section title={'Drilldowns Manager'}>
        <EuiText>
          <p>
            <em>Drilldown Manager</em> can be integrated into any app in Kibana. Click the button
            below to open the drilldown manager and see how it works in this example plugin.
          </p>
        </EuiText>
        <EuiSpacer />
        <EuiFlexGroup>
          <EuiFlexItem grow={false}>{openManagerButton}</EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiButton
              color="secondary"
              fill
              iconType="play"
              iconSide="left"
              onClick={() =>
                plugins.uiActionsEnhanced.executeTriggerActions(
                  SAMPLE_ML_JOB_CLICK_TRIGGER,
                  context
                )
              }
            >
              Execute click action
            </EuiButton>
          </EuiFlexItem>
        </EuiFlexGroup>
      </Section>

      {showManager && (
        <EuiFlyout onClose={() => setShowManager(false)} aria-labelledby="Drilldown Manager">
          <plugins.uiActionsEnhanced.FlyoutManageDrilldowns
            onClose={() => setShowManager(false)}
            viewMode={viewRef.current}
            dynamicActionManager={manager}
            triggers={[SAMPLE_ML_JOB_CLICK_TRIGGER]}
          />
        </EuiFlyout>
      )}
    </div>
  );
};
