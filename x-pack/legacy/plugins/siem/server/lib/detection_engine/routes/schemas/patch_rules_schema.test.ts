/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { AlertAction } from '../../../../../../../../plugins/alerting/common';
import { patchRulesSchema } from './patch_rules_schema';
import { PatchRuleAlertParamsRest } from '../../rules/types';
import { ThreatParams, RuleAlertAction } from '../../types';
import { setFeatureFlagsForTestsOnly, unSetFeatureFlagsForTestsOnly } from '../../feature_flags';

describe('patch rules schema', () => {
  beforeAll(() => {
    setFeatureFlagsForTestsOnly();
  });

  afterAll(() => {
    unSetFeatureFlagsForTestsOnly();
  });

  test('empty objects do not validate as they require at least id or rule_id', () => {
    expect(patchRulesSchema.validate<Partial<PatchRuleAlertParamsRest>>({}).error).toBeTruthy();
  });

  test('made up values do not validate', () => {
    expect(
      patchRulesSchema.validate<Partial<PatchRuleAlertParamsRest & { madeUp: string }>>({
        madeUp: 'hi',
      }).error
    ).toBeTruthy();
  });

  test('[id] does validate', () => {
    expect(
      patchRulesSchema.validate<Partial<PatchRuleAlertParamsRest>>({
        id: 'rule-1',
      }).error
    ).toBeFalsy();
  });

  test('[rule_id] does validate', () => {
    expect(
      patchRulesSchema.validate<Partial<PatchRuleAlertParamsRest>>({
        rule_id: 'rule-1',
      }).error
    ).toBeFalsy();
  });

  test('[id] and [rule_id] does not validate', () => {
    expect(
      patchRulesSchema.validate<Partial<PatchRuleAlertParamsRest>>({
        id: 'id-1',
        rule_id: 'rule-1',
      }).error.message
    ).toEqual('"value" contains a conflict between exclusive peers [id, rule_id]');
  });

  test('[rule_id, description] does validate', () => {
    expect(
      patchRulesSchema.validate<Partial<PatchRuleAlertParamsRest>>({
        rule_id: 'rule-1',
        description: 'some description',
      }).error
    ).toBeFalsy();
  });

  test('[id, description] does validate', () => {
    expect(
      patchRulesSchema.validate<Partial<PatchRuleAlertParamsRest>>({
        id: 'rule-1',
        description: 'some description',
      }).error
    ).toBeFalsy();
  });

  test('[id, risk_score] does validate', () => {
    expect(
      patchRulesSchema.validate<Partial<PatchRuleAlertParamsRest>>({
        id: 'rule-1',
        risk_score: 10,
      }).error
    ).toBeFalsy();
  });

  test('[rule_id, description, from] does validate', () => {
    expect(
      patchRulesSchema.validate<Partial<PatchRuleAlertParamsRest>>({
        rule_id: 'rule-1',
        description: 'some description',
        from: 'now-5m',
      }).error
    ).toBeFalsy();
  });

  test('[id, description, from] does validate', () => {
    expect(
      patchRulesSchema.validate<Partial<PatchRuleAlertParamsRest>>({
        id: 'rule-1',
        description: 'some description',
        from: 'now-5m',
      }).error
    ).toBeFalsy();
  });

  test('[rule_id, description, from, to] does validate', () => {
    expect(
      patchRulesSchema.validate<Partial<PatchRuleAlertParamsRest>>({
        rule_id: 'rule-1',
        description: 'some description',
        from: 'now-5m',
        to: 'now',
      }).error
    ).toBeFalsy();
  });

  test('[id, description, from, to] does validate', () => {
    expect(
      patchRulesSchema.validate<Partial<PatchRuleAlertParamsRest>>({
        id: 'rule-1',
        description: 'some description',
        from: 'now-5m',
        to: 'now',
      }).error
    ).toBeFalsy();
  });

  test('[rule_id, description, from, to, name] does validate', () => {
    expect(
      patchRulesSchema.validate<Partial<PatchRuleAlertParamsRest>>({
        rule_id: 'rule-1',
        description: 'some description',
        from: 'now-5m',
        to: 'now',
        name: 'some-name',
      }).error
    ).toBeFalsy();
  });

  test('[id, description, from, to, name] does validate', () => {
    expect(
      patchRulesSchema.validate<Partial<PatchRuleAlertParamsRest>>({
        id: 'rule-1',
        description: 'some description',
        from: 'now-5m',
        to: 'now',
        name: 'some-name',
      }).error
    ).toBeFalsy();
  });

  test('[rule_id, description, from, to, name, severity] does validate', () => {
    expect(
      patchRulesSchema.validate<Partial<PatchRuleAlertParamsRest>>({
        rule_id: 'rule-1',
        description: 'some description',
        from: 'now-5m',
        to: 'now',
        name: 'some-name',
        severity: 'low',
      }).error
    ).toBeFalsy();
  });

  test('[id, description, from, to, name, severity] does validate', () => {
    expect(
      patchRulesSchema.validate<Partial<PatchRuleAlertParamsRest>>({
        id: 'rule-1',
        description: 'some description',
        from: 'now-5m',
        to: 'now',
        name: 'some-name',
        severity: 'low',
      }).error
    ).toBeFalsy();
  });

  test('[rule_id, description, from, to, name, severity, type] does validate', () => {
    expect(
      patchRulesSchema.validate<Partial<PatchRuleAlertParamsRest>>({
        rule_id: 'rule-1',
        description: 'some description',
        from: 'now-5m',
        to: 'now',
        name: 'some-name',
        severity: 'low',
        type: 'query',
      }).error
    ).toBeFalsy();
  });

  test('[id, description, from, to, name, severity, type] does validate', () => {
    expect(
      patchRulesSchema.validate<Partial<PatchRuleAlertParamsRest>>({
        id: 'rule-1',
        description: 'some description',
        from: 'now-5m',
        to: 'now',
        name: 'some-name',
        severity: 'low',
        type: 'query',
      }).error
    ).toBeFalsy();
  });

  test('[rule_id, description, from, to, name, severity, type, interval] does validate', () => {
    expect(
      patchRulesSchema.validate<Partial<PatchRuleAlertParamsRest>>({
        rule_id: 'rule-1',
        description: 'some description',
        from: 'now-5m',
        to: 'now',
        name: 'some-name',
        severity: 'low',
        interval: '5m',
        type: 'query',
      }).error
    ).toBeFalsy();
  });

  test('[id, description, from, to, name, severity, type, interval] does validate', () => {
    expect(
      patchRulesSchema.validate<Partial<PatchRuleAlertParamsRest>>({
        id: 'rule-1',
        description: 'some description',
        from: 'now-5m',
        to: 'now',
        name: 'some-name',
        severity: 'low',
        interval: '5m',
        type: 'query',
      }).error
    ).toBeFalsy();
  });

  test('[rule_id, description, from, to, index, name, severity, interval, type] does validate', () => {
    expect(
      patchRulesSchema.validate<Partial<PatchRuleAlertParamsRest>>({
        rule_id: 'rule-1',
        description: 'some description',
        from: 'now-5m',
        to: 'now',
        index: ['index-1'],
        name: 'some-name',
        severity: 'low',
        interval: '5m',
        type: 'query',
      }).error
    ).toBeFalsy();
  });

  test('[id, description, from, to, index, name, severity, interval, type] does validate', () => {
    expect(
      patchRulesSchema.validate<Partial<PatchRuleAlertParamsRest>>({
        id: 'rule-1',
        description: 'some description',
        from: 'now-5m',
        to: 'now',
        index: ['index-1'],
        name: 'some-name',
        severity: 'low',
        interval: '5m',
        type: 'query',
      }).error
    ).toBeFalsy();
  });

  test('[rule_id, description, from, to, index, name, severity, interval, type, query] does validate', () => {
    expect(
      patchRulesSchema.validate<Partial<PatchRuleAlertParamsRest>>({
        rule_id: 'rule-1',
        description: 'some description',
        from: 'now-5m',
        to: 'now',
        index: ['index-1'],
        name: 'some-name',
        severity: 'low',
        interval: '5m',
        type: 'query',
        query: 'some query',
      }).error
    ).toBeFalsy();
  });

  test('[id, description, from, to, index, name, severity, interval, type, query] does validate', () => {
    expect(
      patchRulesSchema.validate<Partial<PatchRuleAlertParamsRest>>({
        id: 'rule-1',
        description: 'some description',
        from: 'now-5m',
        to: 'now',
        index: ['index-1'],
        name: 'some-name',
        severity: 'low',
        interval: '5m',
        type: 'query',
        query: 'some query',
      }).error
    ).toBeFalsy();
  });

  test('[rule_id, description, from, to, index, name, severity, interval, type, query, language] does validate', () => {
    expect(
      patchRulesSchema.validate<Partial<PatchRuleAlertParamsRest>>({
        rule_id: 'rule-1',
        description: 'some description',
        from: 'now-5m',
        to: 'now',
        index: ['index-1'],
        name: 'some-name',
        severity: 'low',
        interval: '5m',
        type: 'query',
        query: 'some query',
        language: 'kuery',
      }).error
    ).toBeFalsy();
  });

  test('[id, description, from, to, index, name, severity, interval, type, query, language] does validate', () => {
    expect(
      patchRulesSchema.validate<Partial<PatchRuleAlertParamsRest>>({
        id: 'rule-1',
        description: 'some description',
        from: 'now-5m',
        to: 'now',
        index: ['index-1'],
        name: 'some-name',
        severity: 'low',
        interval: '5m',
        type: 'query',
        query: 'some query',
        language: 'kuery',
      }).error
    ).toBeFalsy();
  });

  test('[rule_id, description, from, to, index, name, severity, type, filter] does validate', () => {
    expect(
      patchRulesSchema.validate<Partial<PatchRuleAlertParamsRest>>({
        rule_id: 'rule-1',
        description: 'some description',
        from: 'now-5m',
        to: 'now',
        index: ['index-1'],
        name: 'some-name',
        severity: 'low',
        interval: '5m',
        type: 'query',
      }).error
    ).toBeFalsy();
  });

  test('[id, description, from, to, index, name, severity, type, filter] does validate', () => {
    expect(
      patchRulesSchema.validate<Partial<PatchRuleAlertParamsRest>>({
        id: 'rule-1',
        description: 'some description',
        from: 'now-5m',
        to: 'now',
        index: ['index-1'],
        name: 'some-name',
        severity: 'low',
        interval: '5m',
        type: 'query',
      }).error
    ).toBeFalsy();
  });

  test('allows references to be sent as a valid value to patch with', () => {
    expect(
      patchRulesSchema.validate<Partial<PatchRuleAlertParamsRest>>({
        id: 'rule-1',
        description: 'some description',
        from: 'now-5m',
        to: 'now',
        index: ['index-1'],
        name: 'some-name',
        severity: 'low',
        interval: '5m',
        type: 'query',
        references: ['index-1'],
        query: 'some query',
        language: 'kuery',
      }).error
    ).toBeFalsy();
  });

  test('does not default references to an array', () => {
    expect(
      patchRulesSchema.validate<Partial<PatchRuleAlertParamsRest>>({
        id: 'rule-1',
        description: 'some description',
        from: 'now-5m',
        to: 'now',
        index: ['index-1'],
        name: 'some-name',
        severity: 'low',
        interval: '5m',
        type: 'query',
        query: 'some-query',
        language: 'kuery',
      }).value.references
    ).toEqual(undefined);
  });

  test('does not default interval', () => {
    expect(
      patchRulesSchema.validate<Partial<PatchRuleAlertParamsRest>>({
        id: 'rule-1',
        description: 'some description',
        from: 'now-5m',
        to: 'now',
        index: ['index-1'],
        name: 'some-name',
        severity: 'low',
        type: 'query',
      }).value.interval
    ).toEqual(undefined);
  });

  test('does not default max signal', () => {
    expect(
      patchRulesSchema.validate<Partial<PatchRuleAlertParamsRest>>({
        id: 'rule-1',
        description: 'some description',
        from: 'now-5m',
        to: 'now',
        index: ['index-1'],
        name: 'some-name',
        severity: 'low',
        interval: '5m',
        type: 'query',
      }).value.max_signals
    ).toEqual(undefined);
  });

  test('references cannot be numbers', () => {
    expect(
      patchRulesSchema.validate<
        Partial<Omit<PatchRuleAlertParamsRest, 'references'>> & { references: number[] }
      >({
        id: 'rule-1',
        description: 'some description',
        from: 'now-5m',
        to: 'now',
        index: ['index-1'],
        name: 'some-name',
        severity: 'low',
        interval: '5m',
        type: 'query',
        query: 'some-query',
        language: 'kuery',
        references: [5],
      }).error.message
    ).toEqual(
      'child "references" fails because ["references" at position 0 fails because ["0" must be a string]]'
    );
  });

  test('indexes cannot be numbers', () => {
    expect(
      patchRulesSchema.validate<
        Partial<Omit<PatchRuleAlertParamsRest, 'index'>> & { index: number[] }
      >({
        id: 'rule-1',
        description: 'some description',
        from: 'now-5m',
        to: 'now',
        index: [5],
        name: 'some-name',
        severity: 'low',
        interval: '5m',
        type: 'query',
        query: 'some-query',
        language: 'kuery',
      }).error.message
    ).toEqual(
      'child "index" fails because ["index" at position 0 fails because ["0" must be a string]]'
    );
  });

  test('saved_id is not required when type is saved_query and will validate without it', () => {
    expect(
      patchRulesSchema.validate<Partial<PatchRuleAlertParamsRest>>({
        id: 'rule-1',
        description: 'some description',
        from: 'now-5m',
        to: 'now',
        index: ['index-1'],
        name: 'some-name',
        severity: 'low',
        interval: '5m',
        type: 'saved_query',
      }).error
    ).toBeFalsy();
  });

  test('saved_id validates with saved_query', () => {
    expect(
      patchRulesSchema.validate<Partial<PatchRuleAlertParamsRest>>({
        id: 'rule-1',
        description: 'some description',
        from: 'now-5m',
        to: 'now',
        index: ['index-1'],
        name: 'some-name',
        severity: 'low',
        interval: '5m',
        type: 'saved_query',
        saved_id: 'some id',
      }).error
    ).toBeFalsy();
  });

  test('saved_query type can have filters with it', () => {
    expect(
      patchRulesSchema.validate<Partial<PatchRuleAlertParamsRest>>({
        id: 'rule-1',
        description: 'some description',
        from: 'now-5m',
        to: 'now',
        index: ['index-1'],
        name: 'some-name',
        severity: 'low',
        interval: '5m',
        type: 'saved_query',
        saved_id: 'some id',
        filters: [],
      }).error
    ).toBeFalsy();
  });

  test('language validates with kuery', () => {
    expect(
      patchRulesSchema.validate<Partial<PatchRuleAlertParamsRest>>({
        id: 'rule-1',
        description: 'some description',
        from: 'now-5m',
        to: 'now',
        index: ['index-1'],
        name: 'some-name',
        severity: 'low',
        interval: '5m',
        type: 'query',
        references: ['index-1'],
        query: 'some query',
        language: 'kuery',
      }).error
    ).toBeFalsy();
  });

  test('language validates with lucene', () => {
    expect(
      patchRulesSchema.validate<Partial<PatchRuleAlertParamsRest>>({
        id: 'rule-1',
        description: 'some description',
        from: 'now-5m',
        to: 'now',
        index: ['index-1'],
        name: 'some-name',
        severity: 'low',
        interval: '5m',
        type: 'query',
        references: ['index-1'],
        query: 'some query',
        language: 'lucene',
      }).error
    ).toBeFalsy();
  });

  test('language does not validate with something made up', () => {
    expect(
      patchRulesSchema.validate<Partial<PatchRuleAlertParamsRest>>({
        id: 'rule-1',
        description: 'some description',
        from: 'now-5m',
        to: 'now',
        index: ['index-1'],
        name: 'some-name',
        severity: 'low',
        interval: '5m',
        type: 'query',
        references: ['index-1'],
        query: 'some query',
        language: 'something-made-up',
      }).error.message
    ).toEqual('child "language" fails because ["language" must be one of [kuery, lucene]]');
  });

  test('max_signals cannot be negative', () => {
    expect(
      patchRulesSchema.validate<Partial<PatchRuleAlertParamsRest>>({
        id: 'rule-1',
        description: 'some description',
        from: 'now-5m',
        to: 'now',
        index: ['index-1'],
        name: 'some-name',
        severity: 'low',
        interval: '5m',
        type: 'query',
        references: ['index-1'],
        query: 'some query',
        language: 'kuery',
        max_signals: -1,
      }).error.message
    ).toEqual('child "max_signals" fails because ["max_signals" must be greater than 0]');
  });

  test('max_signals cannot be zero', () => {
    expect(
      patchRulesSchema.validate<Partial<PatchRuleAlertParamsRest>>({
        id: 'rule-1',
        description: 'some description',
        from: 'now-5m',
        to: 'now',
        index: ['index-1'],
        name: 'some-name',
        severity: 'low',
        interval: '5m',
        type: 'query',
        references: ['index-1'],
        query: 'some query',
        language: 'kuery',
        max_signals: 0,
      }).error.message
    ).toEqual('child "max_signals" fails because ["max_signals" must be greater than 0]');
  });

  test('max_signals can be 1', () => {
    expect(
      patchRulesSchema.validate<Partial<PatchRuleAlertParamsRest>>({
        id: 'rule-1',
        description: 'some description',
        from: 'now-5m',
        to: 'now',
        index: ['index-1'],
        name: 'some-name',
        severity: 'low',
        interval: '5m',
        type: 'query',
        references: ['index-1'],
        query: 'some query',
        language: 'kuery',
        max_signals: 1,
      }).error
    ).toBeFalsy();
  });

  test('meta can be patched', () => {
    expect(
      patchRulesSchema.validate<Partial<PatchRuleAlertParamsRest>>({
        id: 'rule-1',
        meta: { whateverYouWant: 'anything_at_all' },
      }).error
    ).toBeFalsy();
  });

  test('You cannot patch meta as a string', () => {
    expect(
      patchRulesSchema.validate<Partial<Omit<PatchRuleAlertParamsRest, 'meta'> & { meta: string }>>(
        {
          id: 'rule-1',
          meta: 'should not work',
        }
      ).error.message
    ).toEqual('child "meta" fails because ["meta" must be an object]');
  });

  test('filters cannot be a string', () => {
    expect(
      patchRulesSchema.validate<
        Partial<Omit<PatchRuleAlertParamsRest, 'filters'> & { filters: string }>
      >({
        rule_id: 'rule-1',
        type: 'query',
        filters: 'some string',
      }).error.message
    ).toEqual('child "filters" fails because ["filters" must be an array]');
  });

  test('threat is not defaulted to empty array on patch', () => {
    expect(
      patchRulesSchema.validate<Partial<PatchRuleAlertParamsRest>>({
        id: 'rule-1',
        description: 'some description',
        from: 'now-5m',
        to: 'now',
        index: ['index-1'],
        name: 'some-name',
        severity: 'low',
        interval: '5m',
        type: 'query',
        references: ['index-1'],
        query: 'some query',
        language: 'kuery',
        max_signals: 1,
      }).value.threat
    ).toBe(undefined);
  });

  test('threat is not defaulted to undefined on patch with empty array', () => {
    expect(
      patchRulesSchema.validate<Partial<PatchRuleAlertParamsRest>>({
        id: 'rule-1',
        description: 'some description',
        from: 'now-5m',
        to: 'now',
        index: ['index-1'],
        name: 'some-name',
        severity: 'low',
        interval: '5m',
        type: 'query',
        references: ['index-1'],
        query: 'some query',
        language: 'kuery',
        max_signals: 1,
        threat: [],
      }).value.threat
    ).toMatchObject([]);
  });

  test('threat is valid when updated with all sub-objects', () => {
    const expected: ThreatParams[] = [
      {
        framework: 'fake',
        tactic: {
          id: 'fakeId',
          name: 'fakeName',
          reference: 'fakeRef',
        },
        technique: [
          {
            id: 'techniqueId',
            name: 'techniqueName',
            reference: 'techniqueRef',
          },
        ],
      },
    ];
    expect(
      patchRulesSchema.validate<Partial<PatchRuleAlertParamsRest>>({
        id: 'rule-1',
        description: 'some description',
        from: 'now-5m',
        to: 'now',
        index: ['index-1'],
        name: 'some-name',
        severity: 'low',
        interval: '5m',
        type: 'query',
        references: ['index-1'],
        query: 'some query',
        language: 'kuery',
        max_signals: 1,
        threat: [
          {
            framework: 'fake',
            tactic: {
              id: 'fakeId',
              name: 'fakeName',
              reference: 'fakeRef',
            },
            technique: [
              {
                id: 'techniqueId',
                name: 'techniqueName',
                reference: 'techniqueRef',
              },
            ],
          },
        ],
      }).value.threat
    ).toMatchObject(expected);
  });

  test('threat is invalid when updated with missing property framework', () => {
    expect(
      patchRulesSchema.validate<
        Partial<Omit<PatchRuleAlertParamsRest, 'threat'>> & {
          threat: Array<Partial<Omit<ThreatParams, 'framework'>>>;
        }
      >({
        id: 'rule-1',
        description: 'some description',
        from: 'now-5m',
        to: 'now',
        index: ['index-1'],
        name: 'some-name',
        severity: 'low',
        interval: '5m',
        type: 'query',
        references: ['index-1'],
        query: 'some query',
        language: 'kuery',
        max_signals: 1,
        threat: [
          {
            tactic: {
              id: 'fakeId',
              name: 'fakeName',
              reference: 'fakeRef',
            },
            technique: [
              {
                id: 'techniqueId',
                name: 'techniqueName',
                reference: 'techniqueRef',
              },
            ],
          },
        ],
      }).error.message
    ).toEqual(
      'child "threat" fails because ["threat" at position 0 fails because [child "framework" fails because ["framework" is required]]]'
    );
  });

  test('threat is invalid when updated with missing tactic sub-object', () => {
    expect(
      patchRulesSchema.validate<
        Partial<Omit<PatchRuleAlertParamsRest, 'threat'>> & {
          threat: Array<Partial<Omit<ThreatParams, 'tactic'>>>;
        }
      >({
        id: 'rule-1',
        description: 'some description',
        from: 'now-5m',
        to: 'now',
        index: ['index-1'],
        name: 'some-name',
        severity: 'low',
        interval: '5m',
        type: 'query',
        references: ['index-1'],
        query: 'some query',
        language: 'kuery',
        max_signals: 1,
        threat: [
          {
            framework: 'fake',
            technique: [
              {
                id: 'techniqueId',
                name: 'techniqueName',
                reference: 'techniqueRef',
              },
            ],
          },
        ],
      }).error.message
    ).toEqual(
      'child "threat" fails because ["threat" at position 0 fails because [child "tactic" fails because ["tactic" is required]]]'
    );
  });

  test('threat is invalid when updated with missing technique', () => {
    expect(
      patchRulesSchema.validate<
        Partial<Omit<PatchRuleAlertParamsRest, 'threat'>> & {
          threat: Array<Partial<Omit<ThreatParams, 'technique'>>>;
        }
      >({
        id: 'rule-1',
        description: 'some description',
        from: 'now-5m',
        to: 'now',
        index: ['index-1'],
        name: 'some-name',
        severity: 'low',
        interval: '5m',
        type: 'query',
        references: ['index-1'],
        query: 'some query',
        language: 'kuery',
        max_signals: 1,
        threat: [
          {
            framework: 'fake',
            tactic: {
              id: 'techniqueId',
              name: 'techniqueName',
              reference: 'techniqueRef',
            },
          },
        ],
      }).error.message
    ).toEqual(
      'child "threat" fails because ["threat" at position 0 fails because [child "technique" fails because ["technique" is required]]]'
    );
  });

  test('validates with timeline_id and timeline_title', () => {
    expect(
      patchRulesSchema.validate<Partial<PatchRuleAlertParamsRest>>({
        id: 'rule-1',
        description: 'some description',
        from: 'now-5m',
        to: 'now',
        index: ['index-1'],
        name: 'some-name',
        severity: 'low',
        interval: '5m',
        type: 'saved_query',
        saved_id: 'some id',
        timeline_id: 'some-id',
        timeline_title: 'some-title',
      }).error
    ).toBeFalsy();
  });

  test('You cannot omit timeline_title when timeline_id is present', () => {
    expect(
      patchRulesSchema.validate<Partial<PatchRuleAlertParamsRest>>({
        id: 'rule-1',
        description: 'some description',
        from: 'now-5m',
        to: 'now',
        index: ['index-1'],
        name: 'some-name',
        severity: 'low',
        interval: '5m',
        type: 'saved_query',
        saved_id: 'some id',
        timeline_id: 'some-id',
      }).error.message
    ).toEqual('child "timeline_title" fails because ["timeline_title" is required]');
  });

  test('You cannot have a null value for timeline_title when timeline_id is present', () => {
    expect(
      patchRulesSchema.validate<Partial<PatchRuleAlertParamsRest>>({
        id: 'rule-1',
        description: 'some description',
        from: 'now-5m',
        to: 'now',
        index: ['index-1'],
        name: 'some-name',
        severity: 'low',
        interval: '5m',
        type: 'saved_query',
        saved_id: 'some id',
        timeline_id: 'timeline-id',
        timeline_title: null,
      }).error.message
    ).toEqual('child "timeline_title" fails because ["timeline_title" must be a string]');
  });

  test('You cannot have empty string for timeline_title when timeline_id is present', () => {
    expect(
      patchRulesSchema.validate<Partial<PatchRuleAlertParamsRest>>({
        id: 'rule-1',
        description: 'some description',
        from: 'now-5m',
        to: 'now',
        index: ['index-1'],
        name: 'some-name',
        severity: 'low',
        interval: '5m',
        type: 'saved_query',
        saved_id: 'some id',
        timeline_id: 'some-id',
        timeline_title: '',
      }).error.message
    ).toEqual('child "timeline_title" fails because ["timeline_title" is not allowed to be empty]');
  });

  test('You cannot have timeline_title with an empty timeline_id', () => {
    expect(
      patchRulesSchema.validate<Partial<PatchRuleAlertParamsRest>>({
        id: 'rule-1',
        description: 'some description',
        from: 'now-5m',
        to: 'now',
        index: ['index-1'],
        name: 'some-name',
        severity: 'low',
        interval: '5m',
        type: 'saved_query',
        saved_id: 'some id',
        timeline_id: '',
        timeline_title: 'some-title',
      }).error.message
    ).toEqual('child "timeline_id" fails because ["timeline_id" is not allowed to be empty]');
  });

  test('You cannot have timeline_title without timeline_id', () => {
    expect(
      patchRulesSchema.validate<Partial<PatchRuleAlertParamsRest>>({
        id: 'rule-1',
        description: 'some description',
        from: 'now-5m',
        to: 'now',
        index: ['index-1'],
        name: 'some-name',
        severity: 'low',
        interval: '5m',
        type: 'saved_query',
        saved_id: 'some id',
        timeline_title: 'some-title',
      }).error.message
    ).toEqual('child "timeline_title" fails because ["timeline_title" is not allowed]');
  });

  test('You cannot set the severity to a value other than low, medium, high, or critical', () => {
    expect(
      patchRulesSchema.validate<Partial<PatchRuleAlertParamsRest>>({
        id: 'rule-1',
        risk_score: 50,
        description: 'some description',
        name: 'some-name',
        severity: 'junk',
        type: 'query',
        references: ['index-1'],
        query: 'some query',
        language: 'kuery',
        max_signals: 1,
        version: 1,
      }).error.message
    ).toEqual(
      'child "severity" fails because ["severity" must be one of [low, medium, high, critical]]'
    );
  });

  describe('note', () => {
    test('[rule_id, description, from, to, index, name, severity, interval, type, note] does validate', () => {
      expect(
        patchRulesSchema.validate<Partial<PatchRuleAlertParamsRest>>({
          rule_id: 'rule-1',
          description: 'some description',
          from: 'now-5m',
          to: 'now',
          index: ['index-1'],
          name: 'some-name',
          severity: 'low',
          interval: '5m',
          type: 'query',
          note: '# some documentation markdown',
        }).error
      ).toBeFalsy();
    });

    test('note can be patched', () => {
      expect(
        patchRulesSchema.validate<Partial<PatchRuleAlertParamsRest>>({
          id: 'rule-1',
          note: '# new documentation markdown',
        }).error
      ).toBeFalsy();
    });

    test('You cannot patch note as an object', () => {
      expect(
        patchRulesSchema.validate<
          Partial<Omit<PatchRuleAlertParamsRest, 'note'> & { note: object }>
        >({
          id: 'rule-1',
          note: {
            someProperty: 'something else here',
          },
        }).error.message
      ).toEqual('child "note" fails because ["note" must be a string]');
    });
  });

  test('You cannot send in an array of actions that are missing "group"', () => {
    expect(
      patchRulesSchema.validate<
        Partial<
          Omit<PatchRuleAlertParamsRest, 'actions'> & {
            actions: Array<Omit<RuleAlertAction, 'group'>>;
          }
        >
      >({
        actions: [{ id: 'id', action_type_id: 'action_type_id', params: {} }],
        rule_id: 'rule-1',
        risk_score: 50,
        description: 'some description',
        name: 'some-name',
        severity: 'low',
        type: 'query',
        references: ['index-1'],
        query: 'some query',
        language: 'kuery',
        max_signals: 1,
        version: 1,
      }).error.message
    ).toEqual(
      'child "actions" fails because ["actions" at position 0 fails because [child "group" fails because ["group" is required]]]'
    );
  });

  test('You cannot send in an array of actions that are missing "id"', () => {
    expect(
      patchRulesSchema.validate<
        Partial<
          Omit<PatchRuleAlertParamsRest, 'actions'> & {
            actions: Array<Omit<RuleAlertAction, 'id'>>;
          }
        >
      >({
        actions: [{ group: 'group', action_type_id: 'action_type_id', params: {} }],
        rule_id: 'rule-1',
        risk_score: 50,
        description: 'some description',
        name: 'some-name',
        severity: 'low',
        type: 'query',
        references: ['index-1'],
        query: 'some query',
        language: 'kuery',
        max_signals: 1,
        version: 1,
      }).error.message
    ).toEqual(
      'child "actions" fails because ["actions" at position 0 fails because [child "id" fails because ["id" is required]]]'
    );
  });

  test('You cannot send in an array of actions that are missing "action_type_id"', () => {
    expect(
      patchRulesSchema.validate<
        Partial<
          Omit<PatchRuleAlertParamsRest, 'actions'> & {
            actions: Array<Omit<RuleAlertAction, 'action_type_id'>>;
          }
        >
      >({
        actions: [{ group: 'group', id: 'id', params: {} }],
        rule_id: 'rule-1',
        risk_score: 50,
        description: 'some description',
        name: 'some-name',
        severity: 'low',
        type: 'query',
        references: ['index-1'],
        query: 'some query',
        language: 'kuery',
        max_signals: 1,
        version: 1,
      }).error.message
    ).toEqual(
      'child "actions" fails because ["actions" at position 0 fails because [child "action_type_id" fails because ["action_type_id" is required]]]'
    );
  });

  test('You cannot send in an array of actions that are missing "params"', () => {
    expect(
      patchRulesSchema.validate<
        Partial<
          Omit<PatchRuleAlertParamsRest, 'actions'> & {
            actions: Array<Omit<RuleAlertAction, 'params'>>;
          }
        >
      >({
        actions: [{ group: 'group', id: 'id', action_type_id: 'action_type_id' }],
        rule_id: 'rule-1',
        risk_score: 50,
        description: 'some description',
        name: 'some-name',
        severity: 'low',
        type: 'query',
        references: ['index-1'],
        query: 'some query',
        language: 'kuery',
        max_signals: 1,
        version: 1,
      }).error.message
    ).toEqual(
      'child "actions" fails because ["actions" at position 0 fails because [child "params" fails because ["params" is required]]]'
    );
  });

  test('You cannot send in an array of actions that are including "actionTypeId', () => {
    expect(
      patchRulesSchema.validate<
        Partial<
          Omit<PatchRuleAlertParamsRest, 'actions'> & {
            actions: AlertAction[];
          }
        >
      >({
        actions: [
          {
            group: 'group',
            id: 'id',
            actionTypeId: 'actionTypeId',
            params: {},
          },
        ],
        rule_id: 'rule-1',
        risk_score: 50,
        description: 'some description',
        name: 'some-name',
        severity: 'low',
        type: 'query',
        references: ['index-1'],
        query: 'some query',
        language: 'kuery',
        max_signals: 1,
        version: 1,
      }).error.message
    ).toEqual(
      'child "actions" fails because ["actions" at position 0 fails because [child "action_type_id" fails because ["action_type_id" is required]]]'
    );
  });

  // TODO: (LIST-FEATURE) We can enable this once we change the schema's to not be global per module but rather functions that can create the schema
  // on demand. Since they are per module, we have a an issue where the ENV variables do not take effect. It is better we change all the
  // schema's to be function calls to avoid global side effects or just wait until the feature is available. If you want to test this early,
  // you can remove the .skip and set your env variable of export ELASTIC_XPACK_SIEM_LISTS_FEATURE=true locally
  describe.skip('lists', () => {
    test('[rule_id, description, from, to, index, name, severity, interval, type, filter, risk_score, note, and lists] does validate', () => {
      expect(
        patchRulesSchema.validate<Partial<PatchRuleAlertParamsRest>>({
          rule_id: 'rule-1',
          description: 'some description',
          from: 'now-5m',
          to: 'now',
          index: ['index-1'],
          name: 'some-name',
          severity: 'low',
          interval: '5m',
          type: 'query',
          risk_score: 50,
          note: '# some markdown',
          lists: [
            {
              field: 'source.ip',
              boolean_operator: 'and',
              values: [
                {
                  name: '127.0.0.1',
                  type: 'value',
                },
              ],
            },
            {
              field: 'host.name',
              boolean_operator: 'and not',
              values: [
                {
                  name: 'rock01',
                  type: 'value',
                },
                {
                  name: 'mothra',
                  type: 'value',
                },
              ],
            },
          ],
        }).error
      ).toBeFalsy();
    });

    test('lists can be patched', () => {
      expect(
        patchRulesSchema.validate<Partial<PatchRuleAlertParamsRest>>({
          rule_id: 'some id',
          lists: [
            {
              field: 'source.ip',
              boolean_operator: 'and',
              values: [
                {
                  name: '127.0.0.1',
                  type: 'value',
                },
              ],
            },
            {
              field: 'host.name',
              boolean_operator: 'and not',
              values: [
                {
                  name: 'rock01',
                  type: 'value',
                },
                {
                  name: 'mothra',
                  type: 'value',
                },
              ],
            },
          ],
        }).error
      ).toBeFalsy();
    });

    test('[rule_id, description, from, to, index, name, severity, interval, type, filter, risk_score, note, and empty lists] does validate', () => {
      expect(
        patchRulesSchema.validate<Partial<PatchRuleAlertParamsRest>>({
          rule_id: 'rule-1',
          description: 'some description',
          from: 'now-5m',
          to: 'now',
          index: ['index-1'],
          name: 'some-name',
          severity: 'low',
          interval: '5m',
          type: 'query',
          risk_score: 50,
          note: '# some markdown',
          lists: [],
        }).error
      ).toBeFalsy();
    });

    test('[rule_id, description, from, to, index, name, severity, interval, type, filter, risk_score, note, and invalid lists] does NOT validate', () => {
      expect(
        patchRulesSchema.validate<Partial<Omit<PatchRuleAlertParamsRest, 'lists'>>>({
          rule_id: 'rule-1',
          description: 'some description',
          from: 'now-5m',
          to: 'now',
          index: ['index-1'],
          name: 'some-name',
          severity: 'low',
          interval: '5m',
          type: 'query',
          risk_score: 50,
          note: '# some markdown',
          lists: [{ invalid_value: 'invalid value' }],
        }).error.message
      ).toEqual(
        'child "lists" fails because ["lists" at position 0 fails because [child "field" fails because ["field" is required]]]'
      );
    });

    test('[rule_id, description, from, to, index, name, severity, interval, type, filter, risk_score, note, and non-existent lists] does validate with empty lists', () => {
      expect(
        patchRulesSchema.validate<Partial<Omit<PatchRuleAlertParamsRest, 'lists'>>>({
          rule_id: 'rule-1',
          description: 'some description',
          from: 'now-5m',
          to: 'now',
          index: ['index-1'],
          name: 'some-name',
          severity: 'low',
          interval: '5m',
          type: 'query',
          risk_score: 50,
          note: '# some markdown',
        }).value.lists
      ).toEqual([]);
    });
  });
});
