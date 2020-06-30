/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { createTag } from './routes/create_tag';
import { getAllTags } from './routes/get_all_tags';
import { deleteTag } from './routes/delete_tag';
import { createAttachment } from './routes/create_attachment';
import { RouteParams } from './types';

export const setupRoutes = (params: RouteParams) => {
  createTag(params);
  getAllTags(params);
  deleteTag(params);
  createAttachment(params);
};
