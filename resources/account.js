const performList = async (z, bundle) => {
  const response = await z.request({
    url: 'https://jsonplaceholder.typicode.com/posts',
    params: {
      order_by: 'id desc'
    }
  });
  return response.data
};



module.exports = {
  key: 'account',
  noun: 'Account',

  list: {
    display: {
      label: 'New Account',
      description: 'Lists the accounts.'
    },
    operation: {
      perform: performList,
      inputFields: []
    }
  },

  sample: {
    id: 1,
    name: 'Test'
  },

  outputFields: [
    {key: 'id', label: 'ID'},
    {key: 'name', label: 'Name'}
  ]
};
