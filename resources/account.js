const transform = (account) => {
  return {
    id: account.id,
    name: account.name,
    officialName: account.official_name,
    number: account.number,
    holderId: account.holder_id,
    holderName: account.holder_name,
    type: account.type,
    currency: account.currency,
    balance: account.balance,
    refreshedAt: account.refreshed_at
  }
}

const listAccounts = async (z, bundle) => {
  const response = await z.request({
    url: 'https://api.fintoc.com/v1/accounts',
    params: {
      link_token: bundle.inputData.link_token
    }
  });
  return response.data.map((account) => transform(account))
};


module.exports = {
  key: 'account',
  noun: 'Account',

  list: {
    display: {
      label: 'New Account',
      description: 'Lists the accounts.',
      hidden: true
    },
    operation: {
      perform: listAccounts,
      inputFields: [
        {
          key: 'link_token',
          label: 'Link token',
          helpText: 'The token given from Fintoc when a Link is created',
          required: true
        }
      ]
    }
  },

  sample: {
    id: 'nMNejK7BT8oGbvO4',
    name: 'Cuenta Corriente',
    officialName: 'Cuenta Corriente Moneda Local',
    number: '9530516286',
    holderId: '134910798',
    holderName: 'Jon Snow',
    type: 'checking_account',
    currency: 'CLP',
    balance: {
      available: 7010510,
      current: 7010510,
      limit: 7510510
    },
    refreshedAt: '2020-11-18T18:43:54.591Z'
  },

  outputFields: [
    {key: 'id', label: 'ID'},
    {key: 'officialName', label: 'Official Name'},
    {key: 'number', label: 'Number'},
    {key: 'holderId', label: 'Holder ID'},
    {key: 'holderName', label: 'Holder Name'},
    {key: 'type', label: 'Type'},
    {key: 'currency', label: 'Currency'},
    {key: 'balance__available', label: 'Available Balance'},
    {key: 'balance__current', label: 'Current Balance'},
    {key: 'balance__limit', label: 'Balance Limit'},
    {key: 'refreshedAt', label: 'Last Refresh'},

  ]
};
