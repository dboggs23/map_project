FROM microsoft/dotnet:2.1-sdk AS build-env
# Use native linux file polling for better performance
ENV DOTNET_USE_POLLING_FILE_WATCHER 1
WORKDIR /backend
ENTRYPOINT dotnet watch run --urls=http://+:5000