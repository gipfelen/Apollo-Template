# Create Docker Image
Apollo gives us the possibility to execute your functions locally by using a Docker image.
1. Go into the function folder (e.g. `functions/template-node`):
2. Execute `docker build -t <your-docker-image-name> .`
3. You can now use `<your-docker-image-name>` for the local execution within Apollo.