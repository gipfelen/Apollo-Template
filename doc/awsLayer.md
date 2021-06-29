# Create a custom AWS Python layer
If your python function requires dependencies, which are not included in the default AWS runtime, you need to create a custom AWS layer:
1. Create a copy of the `aws/layers/template-layer` and name it accordingly
2. Navigate to your copy of the folder from above.
3. Add all the required pip dependencies to `requirements.txt`.
4. Execute:
```
docker run -v "$PWD":/var/task "public.ecr.aws/sam/build-python3.8" /bin/sh -c "pip install -r requirements.txt -t python/lib/python3.8/site-packages/; exit"
```
5. Create a zip file with:
```
zip -r ../<your_layer_name>.zip python
```
6. Adjust `aws/lambda.tf`:
    1. Add a new layer to the terraform script:
        ```
        resource "aws_lambda_layer_version" "<your_layer_name>" {
            filename   = "./layers/<your_layer_name>.zip"
            layer_name = "<your_layer_name>"
            
            compatible_runtimes = ["python3.8"]
        }
        ```
    2. Add `"<your_function_name>"` to the function_names array.
    3. Add the path of the zip file to the function_paths array (normally this should be: `"tmp/<your_function_name.zip"`)
    4. Add `"python3.8"` to function_runtimes.
    5. Add `"lambda_function.lambda_handler"` to function_handlers.
    6. Add `[aws_lambda_layer_version.<your_layer_name>.arn]` to function_layers. Your locals block should now look similar to this:
        ```
        locals {
            function_names = ["template-node","template-python","<your_function_name>"]
            function_paths = ["tmp/template-node.zip","tmp/template-node.zip","tmp/<your_function_name.zip"]
            function_runtimes = ["nodejs14.x","python3.8","python3.8"]
            function_handlers = ["index.handler","lambda_function.lambda_handler","lambda_function.lambda_handler"]
            function_layers = [[],[],[aws_lambda_layer_version.<your_layer_name>.arn]]
        }
        ```
    7. Add a new `aws_api_gateway_deployment` block:
        ```
        resource "aws_api_gateway_deployment" "example<index_in_function_names_array>" {
            depends_on = [
                aws_api_gateway_integration.lambda[<index_in_function_names_array>],
                aws_api_gateway_integration.lambda_root[<index_in_function_names_array>],
            ]

            rest_api_id = aws_api_gateway_rest_api.example[<index_in_function_names_array>].id
            stage_name  = local.function_names[<index_in_function_names_array>]
        }
        ```
    8. Add a new output block at the end of `aws/lambda.tf`:
        ```
        output "url_<your-function-name>" {
            value = aws_api_gateway_deployment.example<index_in_function_names_array>.invoke_url
        }
        ```