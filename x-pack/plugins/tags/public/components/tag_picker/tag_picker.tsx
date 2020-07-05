/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, { useMemo, useCallback } from 'react';
import {
  EuiHighlight,
  EuiHealth,
  EuiComboBox,
  EuiComboBoxProps,
  EuiComboBoxOptionOption,
} from '@elastic/eui';
import { TagView } from '../tag/tag';
import { txtPlaceholder } from './i18n';

export interface PickerTagView extends TagView {
  id: string;
}

export interface TagPickerProps extends Pick<EuiComboBoxProps<PickerTagView>, 'fullWidth'> {
  isDisabled?: boolean;
  tags: PickerTagView[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export const TagPicker: React.FC<TagPickerProps> = React.memo(
  ({ isDisabled, tags, selected, onChange, ...rest }) => {
    const options = useMemo<Array<EuiComboBoxOptionOption<PickerTagView>>>(() => {
      return tags.map((value) => ({
        key: value.id,
        label: value.title,
        color: value.color,
        value,
      }));
    }, [tags]);

    const selectedOptions = useMemo<Array<EuiComboBoxOptionOption<PickerTagView>>>(() => {
      return options.filter((option) => selected.indexOf(option.value!.id) > -1);
    }, [options, selected]);

    const handleChange = useCallback(
      (newSelection: Array<EuiComboBoxOptionOption<PickerTagView>>) => {
        onChange(newSelection.map(({ value }) => value!.id));
      },
      [onChange]
    );

    return (
      <EuiComboBox<PickerTagView>
        {...rest}
        isDisabled={isDisabled}
        placeholder={txtPlaceholder}
        options={options}
        selectedOptions={selectedOptions}
        onChange={handleChange}
        renderOption={({ label, color }, searchValue, contentClassName) => {
          return (
            <EuiHealth color={color}>
              <span className={contentClassName}>
                <EuiHighlight search={searchValue}>{label}</EuiHighlight>
              </span>
            </EuiHealth>
          );
        }}
      />
    );
  }
);
