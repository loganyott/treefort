const headers = {
  'Content-Type': 'application/json',
  // Allow CORS
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'Origin, X-Requested-With, Content-Type, Accept'
};

/**
 * @param callbackFn The aws Lambda function that is given to the lambda context which
 * denotes completion of execution.
 */
const uniformResponse = callbackFn => (error, response) => {
  callbackFn(null, {
    statusCode: error ? '400' : '200',
    body: error ? error.message : response,
    headers
  });
};

export default uniformResponse;
