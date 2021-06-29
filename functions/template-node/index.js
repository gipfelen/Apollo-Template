async function templateFunction(params) {
  const input1 = params['input1'];
  
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
      average_deviation: result.average_deviation,
    }),
  };
};

//IBM
exports.main = templateFunction;
