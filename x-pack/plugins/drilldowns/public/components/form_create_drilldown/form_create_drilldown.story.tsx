/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import * as React from 'react';
import { EuiFlyout } from '@elastic/eui';
import { storiesOf } from '@storybook/react';
import { FormCreateDrilldown } from '.';

storiesOf('components/FormCreateDrilldown', module)
  .add('default', () => {
    return <FormCreateDrilldown />;
  })
  .add('open in flyout', () => {
    return (
      <EuiFlyout>
        <FormCreateDrilldown />
      </EuiFlyout>
    );
  });
