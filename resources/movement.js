const { getNext } = require('../lib/pagination.js');

const MOVEMENTS_PER_PAGE = 300;
const MAX_REQUESTS = 10;

const transform = (movement) => {
  return {
    'id': movement.id,
    'amount': movement.amount,
    'postDate': movement.post_date,
    'description': movement.description,
    'transactionDate': movement.transaction_date,
    'currency': movement.currency,
    'referenceId': movement.reference_id,
    'type': movement.type,
    'recipientAccount': movement.recipient_account,
    'senderAccount': movement.sender_account,
    'comment': movement.comment
  }
}

const accountFields = (z, bundle) => {
  if (bundle.authData.linkToken) {
    return [{
      key: 'account_id',
      label: 'Account id',
      helpText: 'The ID of the account in Fintoc',
      required: true,
      dynamic: 'accountList.id.name,number'
    }];
  }
  return [];
}

const listMovements = async (z, bundle) => {
  const response = await z.request({
    url: `https://api.fintoc.com/v1/accounts/${bundle.inputData.account_id}/movements`,
    params: {
      link_token: bundle.authData.linkToken,
      per_page: MOVEMENTS_PER_PAGE
    }
  });

  let results = response.data;
  let nextUrl = getNext(response.getHeader('link'));
  let requestsCount = 0;

  while (nextUrl && requestsCount < MAX_REQUESTS) {
    const response = await z.request({
      url: nextUrl,
      params: {
        link_token: bundle.authData.linkToken,
        per_page: MOVEMENTS_PER_PAGE
      }
    });
    results = results.concat(response.data)
    nextUrl = getNext(response.getHeader('link'))
    requestsCount++
  }

  return results.map((movement) => transform(movement))
};

const sample = {
  'id': 'BO381oEATXonG6bj',
  'amount': -1717,
  'postDate': '2020-04-06T00:00:00.000Z',
  'description': 'Cargo Seguro Proteccion Bancaria',
  'transactionDate': '2020-04-04T02:19:23.000Z',
  'currency': 'CLP',
  'referenceId': '123740123',
  'type': 'other',
  'recipientAccount': null,
  'senderAccount': {
    'holder_id': '771806538',
    'holder_name': 'Comercial y Producción SpA',
    'number': '1530108000',
    'institution': {
      'id': 'cl_banco_de_chile',
      'name': 'Banco de Chile',
      'country': 'cl'
    }
  },
  'comment': 'Comentario genérico'
};

module.exports = {
  key: 'movement',
  noun: 'Movement',

  list: {
    display: {
      label: 'New Movement',
      description: 'Triggers when a new movement is found.',
    },
    operation: {
      inputFields: [
        accountFields,
      ],

      perform: listMovements
    }
  },

  sample: sample,

  outputFields: [
    {key: 'id', label: 'ID', required: true},
    {key: 'amount', label: 'Amount', type: 'integer', required: true},
    {key: 'postDate', label: 'Post Date', required: true},
    {key: 'description', label: 'Description', required: true},
    {key: 'transactionDate', label: 'Transaction Date'},
    {key: 'currency', label: 'Currency', required: true},
    {key: 'referenceId', label: 'Reference ID'},
    {key: 'type', label: 'Type', required: true},
    {key: 'comment', label: 'Comment'},
    {key: 'recipientAccount__holder_id', label: 'Recipient Account Holder ID'},
    {key: 'recipientAccount__holder_name', label: 'Recipient Account Holder Name'},
    {key: 'recipientAccount__number', label: 'Recipient Account Number'},
    {key: 'recipientAccount__institution__id', label: 'Recipient Account Insitution ID'},
    {key: 'recipientAccount__institution__name', label: 'Recipient Account Insitution Name'},
    {key: 'recipientAccount__institution__country', label: 'Recipient Account Insitution Country'},
    {key: 'senderAccount__holder_id', label: 'Sender Account Holder ID'},
    {key: 'senderAccount__holder_name', label: 'Sender Account Holder Name'},
    {key: 'senderAccount__number', label: 'Sender Account Number'},
    {key: 'senderAccount__institution__id', label: 'Sender Account Insitution ID'},
    {key: 'senderAccount__institution__name', label: 'Sender Account Insitution Name'},
    {key: 'senderAccount__institution__country', label: 'Sender Account Insitution Country'}
  ]
};
