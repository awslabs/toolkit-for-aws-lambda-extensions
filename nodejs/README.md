## Toolkit for AWS Lambda Extensions - Node.js

## Requirements


### Installation
To add the library in your code execute:
```bash
npm install aws-lambda-extensions-toolkit
```

### Examples
| Name                                                             | Description                                                            |
|------------------------------------------------------------------|------------------------------------------------------------------------|
| [Base Extension](examples/basic-extension/index.js)              | A primitive extension that prints events in the console                |
| [Sys Metrics Extension](examples/sys-metrics-extension/index.js) | Collects CPU and Memory statics and print in the console               |
| [Telemetry Extension](examples/telemetry-extension/index.js)     | Full fledged implementation of a Telemetry Extension                   |
| [Proxy Extension](examples/proxy-extension/index.js)             | Inspect and sanitize requests to/from function using the Proxy pattern | 


A deployment script is located at `examples/deploy.sh` to simplify the packing and deployment of the examples. 

#### Usage
```bash
./deploy.sh <example-dir>
```

### API Reference
API Reference can be found [here](docs/api.md)