
# Toolkit for AWS Lambda Extensions

Toolkit for AWS Lambda Extensions is a framework designed to streamline the development of [AWS Lambda Extensions](https://docs.aws.amazon.com/lambda/latest/dg/lambda-extensions.html). It eliminates the _[boilerplate code](https://aws.amazon.com/what-is/boilerplate-code/)_ providing reference implementations and abstracts the service APIs complexities to let developers focus on application-specific code.

## Usage
Please, check the specific version for detailed usage including:

- [Node.JS](nodejs/README.md)

## Architecture
Through event-driven approach you can select which event types your extension needs and bind them to your custom handlers.  

![Architecture](assets/architecture.svg)

## Features Roadmap

| Feature       | Node.js |
|---------------|---------|
| Extension API | ✔︎      |
| Telemetry API | ✔︎      |
| Proxy         | ✔︎      |

_✔︎ = supported_
_⏱ = planned_

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This project is licensed under the Apache-2.0 License.

