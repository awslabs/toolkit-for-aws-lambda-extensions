const EVENT_SHUTDOWN_TEMPLATE = JSON.stringify({
    eventType: "SHUTDOWN",
    shutdownReason: "reason for shutdown",
    deadlineMs: 1833409612
}, null, 4);

const EVENT_INVOKE_TEMPLATE = JSON.stringify({
    eventType: "INVOKE",
    deadlineMs: 1833409612,
    requestId: "3da1f2dc-3222-475e-9205-e2e6c6318895",
    invokedFunctionArn: "arn:aws:lambda:us-east-1:123456789012:function:test-function",
    tracing: {
        type: "X-Amzn-Trace-Id",
        value: "Root=1-5f35ae12-0c0fec141ab77a00bc047aa2;Parent=2be948a625588e32;Sampled=1"
    }
}, null, 4);

const EVENT_INVOKE_NEXT_TEMPLATE = JSON.stringify({
        body: {
            message: "Hello World!"
        },
        resource: "/{proxy+}",
        path: "/path/to/resource",
        httpMethod: "POST",
        isBase64Encoded: false,
        queryStringParameters: {
            foo: "bar"
        },
        multiValueQueryStringParameters: {
            foo: ["bar"]
        },
        pathParameters: {
            proxy: "/path/to/resource"
        },
        stageVariables: {
            baz: "qux"
        },
        headers: {
            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Encoding": "gzip, deflate, sdch",
            "Accept-Language": "en-US,en;q=0.8",
            "Cache-Control": "max-age=0",
            "CloudFront-Forwarded-Proto": "https",
            "CloudFront-Is-Desktop-Viewer": "true",
            "CloudFront-Is-Mobile-Viewer": "false",
            "CloudFront-Is-SmartTV-Viewer": "false",
            "CloudFront-Is-Tablet-Viewer": "false",
            "CloudFront-Viewer-Country": "US",
            Host: "1234567890.execute-api.us-east-1.amazonaws.com",
            "Upgrade-Insecure-Requests": "1",
            "User-Agent": "Custom User Agent String",
            Via: "1.1 08f323deadbeefa7af34d5feb414ce27.cloudfront.net (CloudFront)",
            "X-Amz-Cf-Id": "cDehVQoZnx43VYQb9j2-nvCh-9z396Uhbp027Y2JvkCPNLmGJHqlaA=="
        },
        multiValueHeaders: {
            Accept: ["text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"],
            "Accept-Encoding": ["gzip, deflate, sdch"],
            "Accept-Language": ["en-US,en;q=0.8"],
            "Cache-Control": ["max-age=0"],
            "CloudFront-Forwarded-Proto": ["https"],
            "CloudFront-Is-Desktop-Viewer": ["true"],
            "CloudFront-Is-Mobile-Viewer": ["false"],
            "CloudFront-Is-SmartTV-Viewer": ["false"],
            "CloudFront-Is-Tablet-Viewer": ["false"],
            "CloudFront-Viewer-Country": ["US"],
            Host: ["0123456789.execute-api.us-east-1.amazonaws.com"],
            "Upgrade-Insecure-Requests": ["1"],
            "User-Agent": ["Custom User Agent String"],
            Via: ["1.1 08f323deadbeefa7af34d5feb414ce27.cloudfront.net (CloudFront)"],
            "X-Amz-Cf-Id": ["cDehVQoZnx43VYQb9j2-nvCh-9z396Uhbp027Y2JvkCPNLmGJHqlaA=="]
        },
        requestContext: {
            accountId: "123456789012",
            resourceId: "123456",
            stage: "prod",
            requestId: "c6af9ac6-7b61-11e6-9a41-93e8deadbeef",
            requestTime: "09/Apr/2015:12:34:56 +0000",
            requestTimeEpoch: 1428582896000,
            identity: {
                cognitoIdentityPoolId: null,
                accountId: null,
                cognitoIdentityId: null,
                caller: null,
                accessKey: null,
                sourceIp: "*********",
                cognitoAuthenticationType: null,
                cognitoAuthenticationProvider: null,
                userArn: null,
                userAgent: "Custom User Agent String",
                user: null
            },
            path: "/prod/path/to/resource",
            resourcePath: "/{proxy+}",
            httpMethod: "POST",
            apiId: "1234567890",
            protocol: "HTTP/1.1"
        }
}, null, 4);

const EVENT_FUNCTION_RESPONSE_TEMPLATE = JSON.stringify({
    body: {
        message: "Reply from Lambda Function!"
    },
    statusCode: 200
}, null, 4);