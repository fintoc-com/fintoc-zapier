/* globals describe it */
const zapier = require('zapier-platform-core');
const nock = require('nock');

// Use this to make test calls into your app:
const App = require('../../index');
const appTester = zapier.createAppTester(App);


describe('Movement', () => {
  nock('https://api.fintoc.com/v1')
    .get('/accounts/1/movements')
    .query({ link_token: '12345', per_page: 300 })
    .reply(200, [
      {
        'id': 'Xxa86kHamDAjeMG9',
        'description': 'Dolor architecto quibusdam impedit.',
        'amount': -9400958,
        'currency': 'CLP',
        'post_date': '2020-11-18T00:00:00Z',
        'transaction_date': null,
        'reference_id': '123740123',
        'type': 'other',
        'recipient_account': null,
        'sender_account': null,
        'comment': null,
      }
    ]
    );

  it('should GET movements endpoint and transform result', async () => {

    const bundle = { inputData: { account_id: '1', link_token: '12345' } };
    const response = await appTester(App.resources.movement.list.operation.perform, bundle);

    expect(response).toEqual(
      [{
        'id': 'Xxa86kHamDAjeMG9',
        'description': 'Dolor architecto quibusdam impedit.',
        'amount': -9400958,
        'currency': 'CLP',
        'postDate': '2020-11-18T00:00:00Z',
        'transactionDate': null,
        'referenceId': '123740123',
        'type': 'other',
        'recipientAccount': null,
        'senderAccount': null,
        'comment': null,
      }]
      )
    });

    it('should iterate over the pages', async () => {
      const linkHeader = '<https://api.fintoc.com/v1/accounts/1/movements&page=1>; rel="first", <https://api.fintoc.com/v1/accounts/1/movements&page=2>;' +
                         'rel="next", <https://api.fintoc.com/v1/accounts/1/movements&page=2>; rel="last"'
      const linkHeader2 = '<https://api.fintoc.com/v1/accounts/1/movements&page=1>; rel="first", <https://api.fintoc.com/v1/accounts/1/movements&page=2>; rel="last"'

      nock('https://api.fintoc.com/v1')
        .get('/accounts/1/movements')
        .query({ link_token: '12345', per_page: 300 })
        .reply(200, [{ id: 1 }], { 'Link': linkHeader });

      nock('https://api.fintoc.com/v1')
        .get('/accounts/1/movements&page=2')
        .query({ link_token: '12345', per_page: 300 })
        .reply(200, [{ id: 2 }], { 'Link': linkHeader2 });

      const bundle = { inputData: { account_id: '1', link_token: '12345' } };
      const response = await appTester(App.resources.movement.list.operation.perform, bundle);

      expect(response).toHaveLength(2);
  })
});
