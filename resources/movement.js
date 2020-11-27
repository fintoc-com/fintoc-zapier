const transform = (movement) => {
  return {
    'id': movement.id,
    'amount': movement.amount,
    'postDate': movement.post_date,
    'description': movement.description,
    'transactionDate': movement.transaction_date,
    'currency': movement.currency,
    'type': movement.type,
    'recipientAccount': movement.recipient_account,
    'senderAccount': movement.sender_account,
    'comment': movement.comment
  }
}

// get a list of movements
const performList = async (z, bundle) => {
  const response = await z.request({
    url: `https://api.fintoc.com/v1/accounts/${bundle.inputData.account_id}/movements`,
    params: {
      link_token: bundle.inputData.link_token
    }
  });
  return response.data.map((movement) => transform(movement))
};

// find a particular movement by name (or other search criteria)
const performSearch = async (z, bundle) => {
  const response = await z.request({
    url: 'https://jsonplaceholder.typicode.com/posts',
    params: {
      name: bundle.inputData.name
    }
  });
  return response.data
};

// creates a new movement
const performCreate = async (z, bundle) => {
  const response = await z.request({
    method: 'POST',
    url: 'https://jsonplaceholder.typicode.com/posts',
    body: {
      name: bundle.inputData.name // json by default
    }
  });
  return response.data
};

const sample = {
  'id': 'BO381oEATXonG6bj',
  'amount': -1717,
  'postDate': '2020-04-06T00:00:00.000Z',
  'description': 'Cargo Seguro Proteccion Bancaria',
  'transactionDate': '2020-04-04T02:19:23.000Z',
  'currency': 'CLP',
  'type': 'other',
  'recipientAccount': {},
  'senderAccount': {},
  'comment': 'Comentario genérico'
};

module.exports = {
  // see here for a full list of available properties:
  // https://github.com/zapier/zapier-platform/blob/master/packages/schema/docs/build/schema.md#resourceschema
  key: 'movement',
  noun: 'Movement',

  // If `get` is defined, it will be called after a `search` or `create`
  // useful if your `searches` and `creates` return sparse objects
  // get: {
  //   display: {
  //     label: 'Get Movement',
  //     description: 'Gets a movement.'
  //   },
  //   operation: {
  //     inputFields: [
  //       {key: 'id', required: true}
  //     ],
  //     perform: defineMe
  //   }
  // },

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
          required: true
        },
        {
          key: 'account_id',
          label: 'Account id',
          helpText: 'The ID of the account in Fintoc',
          required: true
        }
      ],

      perform: performList
    }
  },

  search: {
    display: {
      label: 'Find Movement',
      description: 'Finds a movement give.'
    },
    operation: {
      inputFields: [
        {key: 'name', required: true}
      ],
      perform: performSearch
    },
  },

  create: {
    display: {
      label: 'Create Movement',
      description: 'Creates a new movement.'
    },
    operation: {
      inputFields: [
        {key: 'name', required: true}
      ],
      perform: performCreate
    },
  },

  // In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
  // from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of
  // returned records, and have obvious placeholder values that we can show to any user.
  // In this resource, the sample is reused across all methods
  sample: sample,

  // If fields are custom to each user (like spreadsheet columns), `outputFields` can create human labels
  // For a more complete example of using dynamic fields see
  // https://github.com/zapier/zapier-platform/tree/master/packages/cli#customdynamic-fields
  // Alternatively, a static field definition can be provided, to specify labels for the fields
  // In this resource, these output fields are reused across all resources
  outputFields: [
    {key: 'id', label: 'ID'},
    {key: 'amount', label: 'Amount'},
    {key: 'postDate', label: 'Post Date'},
    {key: 'description', label: 'Description'},
    {key: 'transactionDate', label: 'Transaction Date'},
    {key: 'currency', label: 'Currency'},
    {key: 'type', label: 'Type'},
    {key: 'recipientAccount', label: 'Recipient Account'},
    {key: 'senderAccount', label: 'Sender Account'},
    {key: 'comment', label: 'Comment'},
  ]
};
