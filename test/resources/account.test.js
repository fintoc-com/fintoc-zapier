/* globals describe it */
const zapier = require('zapier-platform-core');
const nock = require('nock');

// Use this to make test calls into your app:
const App = require('../../index');
const appTester = zapier.createAppTester(App);

describe('Account', () => {
  beforeEach(() => {
    nock('https://api.fintoc.com/v1')
      .get('/accounts')
      .query({ link_token: '12345' })
      .reply(200, [
        {
          'id': 'nMNejK7BT8oGbvO4',
          'name': 'Cuenta Corriente',
          'official_name': 'Cuenta Corriente Moneda Local',
          'number': '9530516286',
          'holder_id': '134910798',
          'holder_name': 'Jon Snow',
          'type': 'checking_account',
          'currency': 'CLP',
          'balance': {
            'available': 7010510,
            'current': 7010510,
            'limit': 7510510
          },
          'refreshed_at': '2020-11-18T18:43:54.591Z'
        }
      ]);
  });

  it('should GET accounts endpoint and transform result', async () => {

    const bundle = { authData: { linkToken: '12345' } };
    const response = await appTester(App.resources.account.list.operation.perform, bundle);

    expect(response).toEqual(
      [{
        'id': 'nMNejK7BT8oGbvO4',
        'name': 'Cuenta Corriente',
        'officialName': 'Cuenta Corriente Moneda Local',
        'number': '9530516286',
        'holderId': '134910798',
        'holderName': 'Jon Snow',
        'type': 'checking_account',
        'currency': 'CLP',
        'balance': {
          'available': 7010510,
          'current': 7010510,
          'limit': 7510510
        },
        'refreshedAt': '2020-11-18T18:43:54.591Z'
      }]
    )
  });
});
