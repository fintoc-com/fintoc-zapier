'use strict';

// You want to make a request to an endpoint that is either specifically designed
// to test auth, or one that every user will have access to. eg: `/me`.
// By returning the entire request object, you have access to the request and
// response data for testing purposes. Your connection label can access any data
// from the returned response using the `json.` prefix. eg: `{{json.username}}`.
const test = async (z, bundle) => {
  return z.request({
    url: `https://api.fintoc.com/v1/links/${bundle.authData.linkToken}`
  });
}
// This function runs after every outbound request. You can use it to check for
// errors or modify the response. You can have as many as you need. They'll need
// to each be registered in your index.js file.
const handleBadResponses = (response, z, bundle) => {
  if (response.status === 401) {
    throw new z.errors.Error(
      // This message is surfaced to the user
      'The API Key you supplied is incorrect',
      'AuthenticationError',
      response.status
    );
  }
  if (response.status === 403 && response.data.error.code === 'invalid_link_token') {
    throw new z.errors.Error(
      'The Link Token you supplied is incorrect',
      'AuthenticationError',
      response.status
    );
  }

  return response;
};

// This function runs before every outbound request. You can have as many as you
// need. They'll need to each be registered in your index.js file.
const includeApiKey = (request, z, bundle) => {
  request.headers.Authorization = bundle.authData.apiKey;

  return request;
};

const getConnectionLabel = (z, bundle) => {
  const institution = bundle.inputData.data.institution.name;
  const holderId = bundle.inputData.data.holder_id;
  return `${institution} - ${holderId}`;
};

module.exports = {
  config: {
    // "custom" is the catch-all auth type. The user supplies some info and Zapier can
    // make authenticated requests with it
    type: 'custom',

    // Define any input app's auth requires here. The user will be prompted to enter
    // this info when they connect their account.
    fields: [
      {
        key: 'apiKey',
        label: 'API Key',
        helpText: 'You can view and manage your API keys in the [Fintoc Dashboard](https://app.fintoc.com/api-keys).',
        required: true
      },
      {
        key: 'linkToken',
        label: 'Link token',
        helpText: 'The token given from Fintoc when a Link is created. For more more information check the [docs](https://docs.fintoc.com/docs/conceptos#link-token)',
        required: true
      }
    ],

    // The test method allows Zapier to verify that the credentials a user provides
    // are valid. We'll execute this method whenver a user connects their account for
    // the first time.
    test,

    // This template string can access all the data returned from the auth test. If
    // you return the test object, you'll access the returned data with a label like
    // `{{json.X}}`. If you return `response.data` from your test, then your label can
    // be `{{X}}`. This can also be a function that returns a label. That function has
    // the standard args `(z, bundle)` and data returned from the test can be accessed
    // in `bundle.inputData.X`.
    connectionLabel: getConnectionLabel,
  },
  befores: [includeApiKey],
  afters: [handleBadResponses],
};
