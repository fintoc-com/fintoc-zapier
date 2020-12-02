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
  if (bundle.inputData.link_token) {
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
      link_token: bundle.inputData.link_token
    }
  });
  return response.data.map((movement) => transform(movement))
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
  'recipientAccount': {},
  'senderAccount': {},
  'comment': 'Comentario genérico'
};

module.exports = {
  key: 'movement',
  noun: 'Movement',

  list: {
    display: {
      label: 'New Movement',
      description: 'Lists the movements.',
    },
    operation: {
      inputFields: [
        {
          key: 'link_token',
          label: 'Link token',
          helpText: 'The token given from Fintoc when a Link is created',
          required: true,
          altersDynamicFields: true
        },
        accountFields,
      ],

      perform: listMovements
    }
  },

  sample: sample,

  outputFields: [
    {key: 'id', label: 'ID'},
    {key: 'amount', label: 'Amount'},
    {key: 'postDate', label: 'Post Date'},
    {key: 'description', label: 'Description'},
    {key: 'transactionDate', label: 'Transaction Date'},
    {key: 'currency', label: 'Currency'},
    {key: 'referenceId', label: 'Reference ID'},
    {key: 'type', label: 'Type'},
    {key: 'recipientAccount', label: 'Recipient Account'},
    {key: 'senderAccount', label: 'Sender Account'},
    {key: 'comment', label: 'Comment'},
  ]
};
