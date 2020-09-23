/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import * as React from 'react';
import { EuiCard, EuiFlexItem, EuiIcon } from '@elastic/eui';

export const ButtonEmbeddableComponent: React.FC = () => {
  return (
    <EuiFlexItem>
      <EuiCard
        icon={<EuiIcon size="xxl" type={`logoKibana`} />}
        title={`Click me!`}
        description={'This embeddable fires "VALUE_CLICK" trigger on click'}
        onClick={() => window.alert('Card clicked')}
      />
    </EuiFlexItem>
  );
};
