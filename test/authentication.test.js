/* globals describe, it, expect */

const zapier = require('zapier-platform-core');

const App = require('../index');
const appTester = zapier.createAppTester(App);
const nock = require('nock');

describe('custom auth', () => {


  it('passes authentication and returns json', async () => {
    const linkToken = '123456';
    const bundle = {
      authData: {
        apiKey: 'secret-key',
        linkToken,
      },
    };

    nock('https://api.fintoc.com/v1', {
      reqheaders: {
          authorization: 'secret-key',
        },
      })
      .get(`/links/${linkToken}`)
      .reply(200, { foo: 'bar' })

    const response = await appTester(App.authentication.test, bundle);

    expect(response.status).toBe(200);
    expect(response.data).toEqual({ foo: 'bar'});
  });

  it('fails on bad auth', async () => {
    const linkToken = '123456';
    const bundle = {
      authData: {
        apiKey: 'bad-key',
        linkToken
      },
    };

    nock('https://api.fintoc.com/v1').get(`/links/${linkToken}`).reply(401);

    try {
      await appTester(App.authentication.test, bundle);
    } catch (error) {
      expect(error.message).toContain('The API Key you supplied is incorrect');
      return;
    }
    throw new Error('appTester should have thrown');
  });
  it('fails on bad link token', async () => {
    const linkToken = 'bad-token';
    const bundle = {
      authData: {
        apiKey: 'secret-key',
        linkToken,
      },
    };

    nock('https://api.fintoc.com/v1').get(`/links/${linkToken}`).reply(403, {
      error: { code: 'invalid_link_token' }
    });

    try {
      await appTester(App.authentication.test, bundle);
    } catch (error) {
      expect(error.message).toContain('The Link Token you supplied is incorrect');
      return;
    }
    throw new Error('appTester should have thrown');
  });
});
