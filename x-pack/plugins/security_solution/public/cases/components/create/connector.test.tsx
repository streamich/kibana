/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';
import { mount } from 'enzyme';
import { act, waitFor } from '@testing-library/react';
import { EuiComboBox, EuiComboBoxOptionOption } from '@elastic/eui';

import { useForm, Form, FormHook } from '../../../shared_imports';
import { connectorsMock } from '../../containers/mock';
import { Connector } from './connector';
import { useConnectors } from '../../containers/configure/use_connectors';
import { useGetIncidentTypes } from '../connectors/resilient/use_get_incident_types';
import { useGetSeverity } from '../connectors/resilient/use_get_severity';
import { useGetChoices } from '../connectors/servicenow/use_get_choices';
import { incidentTypes, severity, choices } from '../connectors/mock';
import { schema, FormProps } from './schema';

jest.mock('../../../common/lib/kibana', () => {
  return {
    useKibana: () => ({
      services: {
        notifications: {},
        http: {},
      },
    }),
  };
});
jest.mock('../../containers/configure/use_connectors');
jest.mock('../connectors/resilient/use_get_incident_types');
jest.mock('../connectors/resilient/use_get_severity');
jest.mock('../connectors/servicenow/use_get_choices');

const useConnectorsMock = useConnectors as jest.Mock;
const useGetIncidentTypesMock = useGetIncidentTypes as jest.Mock;
const useGetSeverityMock = useGetSeverity as jest.Mock;
const useGetChoicesMock = useGetChoices as jest.Mock;

const useGetIncidentTypesResponse = {
  isLoading: false,
  incidentTypes,
};

const useGetSeverityResponse = {
  isLoading: false,
  severity,
};

const useGetChoicesResponse = {
  isLoading: false,
  choices,
};

describe('Connector', () => {
  let globalForm: FormHook;

  const MockHookWrapperComponent: React.FC = ({ children }) => {
    const { form } = useForm<FormProps>({
      defaultValue: { connectorId: connectorsMock[0].id, fields: null },
      schema: {
        connectorId: schema.connectorId,
        fields: schema.fields,
      },
    });

    globalForm = form;

    return <Form form={form}>{children}</Form>;
  };

  beforeEach(() => {
    jest.resetAllMocks();
    useConnectorsMock.mockReturnValue({ loading: false, connectors: connectorsMock });
    useGetIncidentTypesMock.mockReturnValue(useGetIncidentTypesResponse);
    useGetSeverityMock.mockReturnValue(useGetSeverityResponse);
    useGetChoicesMock.mockReturnValue(useGetChoicesResponse);
  });

  it('it renders', async () => {
    const wrapper = mount(
      <MockHookWrapperComponent>
        <Connector isLoading={false} />
      </MockHookWrapperComponent>
    );

    expect(wrapper.find(`[data-test-subj="caseConnectors"]`).exists()).toBeTruthy();
    expect(wrapper.find(`[data-test-subj="connector-fields"]`).exists()).toBeTruthy();

    await waitFor(() => {
      expect(wrapper.find(`button[data-test-subj="dropdown-connectors"]`).first().text()).toBe(
        'My Connector'
      );
    });

    // await waitFor(() => {
    //   wrapper.update();
    //   expect(wrapper.find(`[data-test-subj="connector-fields-sn"]`).exists()).toBeTruthy();
    // });
  });

  it('it is loading when fetching connectors', async () => {
    useConnectorsMock.mockReturnValue({ loading: true, connectors: connectorsMock });
    const wrapper = mount(
      <MockHookWrapperComponent>
        <Connector isLoading={false} />
      </MockHookWrapperComponent>
    );

    expect(
      wrapper.find('[data-test-subj="dropdown-connectors"]').first().prop('isLoading')
    ).toEqual(true);
  });

  it('it is disabled when fetching connectors', async () => {
    useConnectorsMock.mockReturnValue({ loading: true, connectors: connectorsMock });
    const wrapper = mount(
      <MockHookWrapperComponent>
        <Connector isLoading={false} />
      </MockHookWrapperComponent>
    );

    expect(wrapper.find('[data-test-subj="dropdown-connectors"]').first().prop('disabled')).toEqual(
      true
    );
  });

  it('it is disabled and loading when passing loading as true', async () => {
    const wrapper = mount(
      <MockHookWrapperComponent>
        <Connector isLoading={true} />
      </MockHookWrapperComponent>
    );

    expect(
      wrapper.find('[data-test-subj="dropdown-connectors"]').first().prop('isLoading')
    ).toEqual(true);
    expect(wrapper.find('[data-test-subj="dropdown-connectors"]').first().prop('disabled')).toEqual(
      true
    );
  });

  it(`it should change connector`, async () => {
    const wrapper = mount(
      <MockHookWrapperComponent>
        <Connector isLoading={false} />
      </MockHookWrapperComponent>
    );

    await waitFor(() => {
      expect(wrapper.find(`[data-test-subj="connector-fields-resilient"]`).exists()).toBeFalsy();
      wrapper.find('button[data-test-subj="dropdown-connectors"]').simulate('click');
      wrapper.find(`button[data-test-subj="dropdown-connector-resilient-2"]`).simulate('click');
      wrapper.update();
    });

    await waitFor(() => {
      wrapper.update();
      expect(wrapper.find(`[data-test-subj="connector-fields-resilient"]`).exists()).toBeTruthy();
    });

    act(() => {
      ((wrapper.find(EuiComboBox).props() as unknown) as {
        onChange: (a: EuiComboBoxOptionOption[]) => void;
      }).onChange([{ value: '19', label: 'Denial of Service' }]);
    });

    act(() => {
      wrapper
        .find('select[data-test-subj="severitySelect"]')
        .first()
        .simulate('change', {
          target: { value: '4' },
        });
    });

    await waitFor(() => {
      expect(globalForm.getFormData()).toEqual({
        connectorId: 'resilient-2',
        fields: { incidentTypes: ['19'], severityCode: '4' },
      });
    });
  });
});
