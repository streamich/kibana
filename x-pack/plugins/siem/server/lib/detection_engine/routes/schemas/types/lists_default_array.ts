/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import * as t from 'io-ts';
import { Either } from 'fp-ts/lib/Either';

import {
  list_and as listAnd,
  list_values as listValues,
  list_values_operator as listOperator,
} from '../response/schemas';

export type ListsDefaultArrayC = t.Type<List[], List[], unknown>;
export type List = t.TypeOf<typeof listAnd>;
export type ListValues = t.TypeOf<typeof listValues>;
export type ListOperator = t.TypeOf<typeof listOperator>;

/**
 * Types the ListsDefaultArray as:
 *   - If null or undefined, then a default array will be set for the list
 */
export const ListsDefaultArray: ListsDefaultArrayC = new t.Type<List[], List[], unknown>(
  'listsWithDefaultArray',
  t.array(listAnd).is,
  (input): Either<t.Errors, List[]> =>
    input == null ? t.success([]) : t.array(listAnd).decode(input),
  t.identity
);

export type ListsDefaultArraySchema = t.TypeOf<typeof ListsDefaultArray>;
