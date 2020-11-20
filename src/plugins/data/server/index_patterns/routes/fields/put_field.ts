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

import { schema } from '@kbn/config-schema';
import { IRouter } from '../../../../../../core/server';
import { assertIndexPatternsContext } from '../util/assert_index_patterns_context';
import { handleErrors } from '../util/handle_errors';
import { fieldSpecSchema } from '../util/schemas';

export const registerPutFieldRoute = (router: IRouter) => {
  router.put(
    {
      path: '/api/index_patterns/index_pattern/{id}/field',
      validate: {
        params: schema.object(
          {
            id: schema.string({
              minLength: 1,
              maxLength: 1_000,
            }),
          },
          { unknowns: 'allow' }
        ),
        body: schema.object({
          skip_field_refresh: schema.maybe(schema.boolean({ defaultValue: false })),
          field: fieldSpecSchema,
        }),
      },
    },
    router.handleLegacyErrors(
      handleErrors(
        assertIndexPatternsContext(async (ctx, req, res) => {
          const ip = ctx.indexPatterns.indexPatterns;
          const id = req.params.id;
          const {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            skip_field_refresh = false,
            field,
          } = req.body;

          const indexPattern = await ip.get(id);

          const oldFieldObject = indexPattern.fields.getByName(field.name);
          if (!!oldFieldObject) {
            indexPattern.fields.remove(oldFieldObject);
          }

          indexPattern.fields.add(field);

          await ip.updateSavedObject(indexPattern);
          if (!skip_field_refresh) {
            await ip.refreshFields(indexPattern);
          }

          const fieldObject = indexPattern.fields.getByName(field.name);
          if (!fieldObject) throw new Error(`Could not create a field [name = ${field.name}].`);

          return res.ok({
            headers: {
              'content-type': 'application/json',
            },
            body: JSON.stringify({
              field: fieldObject.toSpec(),
              index_pattern: indexPattern.toSpec(),
            }),
          });
        })
      )
    )
  );
};
