/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { IExternalUrl } from 'src/core/public';
import { UrlDrilldown, ActionContext, Config } from './url_drilldown';
import { IEmbeddable } from '../../../../../../src/plugins/embeddable/public/lib/embeddables';
import { DatatableColumnType } from '../../../../../../src/plugins/expressions/common';

const mockDataPoints = [
  {
    table: {
      columns: [
        {
          name: 'test',
          id: '1-1',
          meta: {
            type: 'number' as DatatableColumnType,
            field: 'bytes',
            index: 'logstash-*',
            sourceParams: {
              indexPatternId: 'logstash-*',
              type: 'histogram',
              params: {
                field: 'bytes',
                interval: 30,
                otherBucket: true,
              },
            },
          },
        },
      ],
      rows: [
        {
          '1-1': '2048',
        },
      ],
    },
    column: 0,
    row: 0,
    value: 'test',
  },
];

const mockEmbeddable = ({
  getInput: () => ({
    filters: [],
    timeRange: { from: 'now-15m', to: 'now' },
    query: { query: 'test', language: 'kuery' },
  }),
  getOutput: () => ({}),
} as unknown) as IEmbeddable;

const mockNavigateToUrl = jest.fn(() => Promise.resolve());

class TextExternalUrl implements IExternalUrl {
  constructor(private readonly isCorrect: boolean = true) {}

  public validateUrl(url: string): URL | null {
    return this.isCorrect ? new URL(url) : null;
  }
}

describe('UrlDrilldown', () => {
  const createDrilldown = (isExternalUrlValid: boolean = true) => {
    const drilldown = new UrlDrilldown({
      externalUrl: new TextExternalUrl(isExternalUrlValid),
      getGlobalScope: () => ({ kibanaUrl: 'http://localhost:5601/' }),
      getSyntaxHelpDocsLink: () => 'http://localhost:5601/docs',
      getVariablesHelpDocsLink: () => 'http://localhost:5601/docs',
      navigateToUrl: mockNavigateToUrl,
    });
    return drilldown;
  };

  const urlDrilldown = createDrilldown();

  test('license', () => {
    expect(urlDrilldown.minimalLicense).toBe('gold');
  });

  describe('isCompatible', () => {
    test('throws if no embeddable', async () => {
      const config: Config = {
        url: {
          template: `https://elasti.co/?{{event.value}}`,
        },
        openInNewTab: false,
      };

      const context: ActionContext = {
        data: {
          data: mockDataPoints,
        },
      };

      await expect(urlDrilldown.isCompatible(config, context)).rejects.toThrowError();
    });

    test('compatible if url is valid', async () => {
      const config: Config = {
        url: {
          template: `https://elasti.co/?{{event.value}}&{{rison context.panel.query}}`,
        },
        openInNewTab: false,
      };

      const context: ActionContext = {
        data: {
          data: mockDataPoints,
        },
        embeddable: mockEmbeddable,
      };

      await expect(urlDrilldown.isCompatible(config, context)).resolves.toBe(true);
    });

    test('not compatible if url is invalid', async () => {
      const config: Config = {
        url: {
          template: `https://elasti.co/?{{event.value}}&{{rison context.panel.somethingFake}}`,
        },
        openInNewTab: false,
      };

      const context: ActionContext = {
        data: {
          data: mockDataPoints,
        },
        embeddable: mockEmbeddable,
      };

      await expect(urlDrilldown.isCompatible(config, context)).resolves.toBe(false);
    });

    test('not compatible if external URL is denied', async () => {
      const drilldown1 = createDrilldown(true);
      const drilldown2 = createDrilldown(false);
      const config: Config = {
        url: {
          template: `https://elasti.co/?{{event.value}}&{{rison context.panel.query}}`,
        },
        openInNewTab: false,
      };

      const context: ActionContext = {
        data: {
          data: mockDataPoints,
        },
        embeddable: mockEmbeddable,
      };

      const result1 = await drilldown1.isCompatible(config, context);
      const result2 = await drilldown2.isCompatible(config, context);

      expect(result1).toBe(true);
      expect(result2).toBe(false);
    });
  });

  describe('getHref & execute', () => {
    beforeEach(() => {
      mockNavigateToUrl.mockReset();
    });

    test('valid url', async () => {
      const config: Config = {
        url: {
          template: `https://elasti.co/?{{event.value}}&{{rison context.panel.query}}`,
        },
        openInNewTab: false,
      };

      const context: ActionContext = {
        data: {
          data: mockDataPoints,
        },
        embeddable: mockEmbeddable,
      };

      const url = await urlDrilldown.getHref(config, context);
      expect(url).toMatchInlineSnapshot(`"https://elasti.co/?test&(language:kuery,query:test)"`);

      await urlDrilldown.execute(config, context);
      expect(mockNavigateToUrl).toBeCalledWith(url);
    });

    test('invalid url', async () => {
      const config: Config = {
        url: {
          template: `https://elasti.co/?{{event.value}}&{{rison context.panel.invalid}}`,
        },
        openInNewTab: false,
      };

      const context: ActionContext = {
        data: {
          data: mockDataPoints,
        },
        embeddable: mockEmbeddable,
      };

      await expect(urlDrilldown.getHref(config, context)).rejects.toThrowError();
      await expect(urlDrilldown.execute(config, context)).rejects.toThrowError();
      expect(mockNavigateToUrl).not.toBeCalled();
    });
  });
});
