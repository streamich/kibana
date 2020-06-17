/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import React from 'react';
import { OverlayStart } from 'kibana/public';
import { EuiFieldText, EuiModalBody, EuiButton } from '@elastic/eui';
import { useState } from 'react';
import { toMountPoint } from '../../../../src/plugins/kibana_react/public';
import { createAction, UiActionsStart } from '../../../../src/plugins/ui_actions/public';

export const USER_TRIGGER = 'USER_TRIGGER';
export const COUNTRY_TRIGGER = 'COUNTRY_TRIGGER';
export const PHONE_TRIGGER = 'PHONE_TRIGGER';

export const ACTION_VIEW_IN_MAPS = 'ACTION_VIEW_IN_MAPS';
export const ACTION_TRAVEL_GUIDE = 'ACTION_TRAVEL_GUIDE';
export const ACTION_CALL_PHONE_NUMBER = 'ACTION_CALL_PHONE_NUMBER';
export const ACTION_EDIT_USER = 'ACTION_EDIT_USER';
export const ACTION_PHONE_USER = 'ACTION_PHONE_USER';
export const ACTION_SHOWCASE_PLUGGABILITY = 'ACTION_SHOWCASE_PLUGGABILITY';

export const showcasePluggability = createAction<typeof ACTION_SHOWCASE_PLUGGABILITY>({
  factoryId: ACTION_SHOWCASE_PLUGGABILITY,
  getDisplayName: () => 'This is pluggable! Any plugin can inject their actions here.',
  execute: async () => alert("Isn't that cool?!"),
});

export interface PhoneContext {
  phone: string;
}

export const makePhoneCallAction = createAction<typeof ACTION_CALL_PHONE_NUMBER>({
  factoryId: ACTION_CALL_PHONE_NUMBER,
  getDisplayName: () => 'Call phone number',
  execute: async (context) => alert(`Pretend calling ${context.phone}...`),
});

export const lookUpWeatherAction = createAction<typeof ACTION_TRAVEL_GUIDE>({
  factoryId: ACTION_TRAVEL_GUIDE,
  getIconType: () => 'popout',
  getDisplayName: () => 'View travel guide',
  execute: async (context) => {
    window.open(`https://www.worldtravelguide.net/?s=${context.country}`, '_blank');
  },
});

export interface CountryContext {
  country: string;
}

export const viewInMapsAction = createAction<typeof ACTION_VIEW_IN_MAPS>({
  factoryId: ACTION_VIEW_IN_MAPS,
  getIconType: () => 'popout',
  getDisplayName: () => 'View in maps',
  execute: async (context) => {
    window.open(`https://www.google.com/maps/place/${context.country}`, '_blank');
  },
});

export interface User {
  phone?: string;
  countryOfResidence: string;
  name: string;
}

function EditUserModal({
  user,
  update,
  close,
}: {
  user: User;
  update: (user: User) => void;
  close: () => void;
}) {
  const [name, setName] = useState(user.name);
  return (
    <EuiModalBody>
      <EuiFieldText prepend="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <EuiButton
        onClick={() => {
          update({ ...user, name });
          close();
        }}
      >
        Update
      </EuiButton>
    </EuiModalBody>
  );
}

export const createEditUserAction = (getOpenModal: () => Promise<OverlayStart['openModal']>) =>
  createAction<typeof ACTION_EDIT_USER>({
    factoryId: ACTION_EDIT_USER,
    getIconType: () => 'pencil',
    getDisplayName: () => 'Edit user',
    execute: async ({ user, update }) => {
      const overlay = (await getOpenModal())(
        toMountPoint(<EditUserModal user={user} update={update} close={() => overlay.close()} />)
      );
    },
  });

export interface UserContext {
  user: User;
  update: (user: User) => void;
}

export const createPhoneUserAction = (getUiActionsApi: () => Promise<UiActionsStart>) =>
  createAction<typeof ACTION_PHONE_USER>({
    factoryId: ACTION_PHONE_USER,
    getDisplayName: () => 'Call phone number',
    isCompatible: async ({ user }) => user.phone !== undefined,
    execute: async ({ user }) => {
      // One option - execute the more specific action directly.
      // makePhoneCallAction.execute({ phone: user.phone });

      // Another option - emit the trigger and automatically get *all* the actions attached
      // to the phone number trigger.
      // TODO: we need to figure out the best way to handle these nested actions however, since
      // we don't want multiple context menu's to pop up.
      if (user.phone !== undefined) {
        (await getUiActionsApi()).executeTriggerActions(PHONE_TRIGGER, { phone: user.phone });
      }
    },
  });
