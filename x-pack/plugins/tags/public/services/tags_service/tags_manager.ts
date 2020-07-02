/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

/* eslint-disable max-classes-per-file, react-hooks/rules-of-hooks */

import { useMemo } from 'react';
import { BehaviorSubject, Observable, from, of, iif } from 'rxjs';
import { map, share, switchMap } from 'rxjs/operators';
import useObservable from 'react-use/lib/useObservable';
import {
  ITagsClient,
  RawTagWithId,
  TagsClientCreateParams,
  ITagAttachmentsClient,
} from '../../../common';

export interface TagsManagerParams {
  tags: ITagsClient;
  attachments: ITagAttachmentsClient;
}

export class Tag {
  public readonly data$: BehaviorSubject<RawTagWithId>;

  public get data(): RawTagWithId {
    return this.data$.getValue();
  }

  public get id(): string {
    return this.data.id;
  }

  constructor(data: RawTagWithId) {
    this.data$ = new BehaviorSubject<RawTagWithId>(data);
  }
}

export type TagMap = Record<string, Tag>;

export type TagListState = 'start' | 'loading' | 'reloading' | 'error' | 'data';

export class TagList {
  constructor(private readonly params: TagsManagerParams) {}

  public readonly state$ = new BehaviorSubject<TagListState>('start');

  public readonly error$ = new BehaviorSubject<Error | null>(null);

  private readonly data$$ = new BehaviorSubject<TagMap>({});
  public get data$(): BehaviorSubject<TagMap> {
    if (this.state$.getValue() === 'start') {
      this.state$.next('loading');
      this.params.tags.getAll().then(
        (response) => {
          const tags: Record<string, Tag> = {};
          for (const rawTag of response.tags) tags[rawTag.id] = new Tag(rawTag);
          this.data$$.next(tags);
          this.state$.next('data');
        },
        (error) => {
          this.error$.next(error);
          this.state$.next('error');
        }
      );
    }
    return this.data$$;
  }

  public readonly initializing$ = this.state$.pipe(
    map((state) => state === 'start' || state === 'loading')
  );

  public tagData$(tagId: string): Observable<RawTagWithId | null> {
    return this.data$.pipe(
      map((tags) => tags[tagId]),
      switchMap((tag) => (tag ? tag.data$ : of(null)))
    );
  }

  public add(rawTag: RawTagWithId): Tag {
    const tag = new Tag(rawTag);
    this.data$$.next({ ...this.data$$.getValue(), [tag.id]: tag });
    return tag;
  }

  public delete(ids: string[]): Tag[] {
    const tags = this.data$$.getValue();
    const newTags: TagMap = {};
    const deletedTags: Tag[] = [];
    for (const tag of Object.values(tags))
      if (!ids.includes(tag.id)) newTags[tag.id] = tag;
      else deletedTags.push(tag);
    this.data$$.next(newTags);
    return deletedTags;
  }

  public insert(tags: Tag[]) {
    const oldTags = this.data$$.getValue();
    const newTags: TagMap = {};
    for (const tag of tags) newTags[tag.id] = tag;
    this.data$$.next({ ...oldTags, ...newTags });
  }

  public readonly useInitializing = () => {
    return useObservable(this.initializing$, true);
  };

  public readonly useData = () => {
    const observable = useMemo(() => this.data$, []);
    return useObservable(observable, observable.getValue());
  };

  public readonly useTag = (tagId: string): RawTagWithId | null => {
    const observable = useMemo(() => this.tagData$(tagId), [tagId]);
    return useObservable(observable, null);
  };
}

export class TagManager {
  constructor(private readonly params: TagsManagerParams) {}

  private readonly list = new TagList(this.params);

  public readonly useInitializing = this.list.useInitializing;
  public readonly useTags = this.list.useData;
  public readonly useTag = this.list.useTag;

  public create$(params: TagsClientCreateParams): Observable<Tag> {
    const { tags: client } = this.params;
    return from(client.create(params)).pipe(
      share(),
      map((response) => {
        const tag = this.list.add(response.tag);
        return tag;
      })
    );
  }

  public delete$(ids: string[]): Observable<void> {
    const { tags: client } = this.params;
    const deletedTags = this.list.delete(ids);
    const promise = Promise.all(ids.map((id) => client.del({ id }))).then(() => undefined);
    const observable = from(promise).pipe(share());

    observable.subscribe({
      error: () => this.list.insert(deletedTags),
    });

    return observable;
  }
}
