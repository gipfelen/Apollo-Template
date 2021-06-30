async function templateFunction(params) {
  const body = params;
  const input1 = body['input1']
  const response = {
    input1: input1
  };

  return response;
}

//AWS CALL
exports.handler = async (event) => {  
  const body = JSON.parse(event.body);
  result = await templateFunction(body)
  return {
    statusCode: 200,
    body: JSON.stringify({
      input1: result.input1,
    }),
  };
};

//IBM
exports.main = templateFunction;