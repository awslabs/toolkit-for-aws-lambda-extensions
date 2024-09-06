export default {
    SubscriptionEvent:{
        "time": "2022-10-12T00:02:35.000Z",
        "type": "platform.telemetrySubscription",
        "record": {
            "name": "my-telemetry-extension",
            "state": "Subscribed",
            "types": [ "platform", "function" ]
        }
    },
    LogsDroppedEvent:{
        "time": "2022-10-12T00:02:35.000Z",
        "type": "platform.logsDropped",
        "record": {
            "droppedBytes": 12345,
            "droppedRecords": 123,
            "reason": "Consumer seems to have fallen behind as it has not acknowledged receipt of logs."
        }
    },
    InitStartEvent:{
        "time": "2022-10-12T00:00:15.064Z",
        "type": "platform.initStart",
        "record": {
            "initializationType": "on-demand",
            "phase": "init",
            "runtimeVersion": "nodejs-14.v3",
            "runtimeVersionArn": "arn",
            "functionName": "myFunction",
            "functionVersion": "$LATEST",
            "instanceId": "82561ce0-53dd-47d1-90e0-c8f5e063e62e",
            "instanceMaxMemory": 256
        }
    },
    InitRuntimeDoneEvent:{
        "time": "2022-10-12T00:01:15.000Z",
        "type": "platform.initRuntimeDone",
        "record": {
            "initializationType": "on-demand",
            "status": "success",
            "spans": [
                {
                    "name": "someTimeSpan",
                    "start": "2022-06-02T12:02:33.913Z",
                    "durationMs": 70.5
                }
            ]
        }
    },
    InitReportEvent:{
        "time": "2022-10-12T00:01:15.000Z",
        "type": "platform.initReport",
        "record": {
            "initializationType": "on-demand",
            "status": "success",
            "phase": "init",
            "metrics": {
                "durationMs": 125.33
            },
            "spans": [
                {
                    "name": "someTimeSpan",
                    "start": "2022-06-02T12:02:33.913Z",
                    "durationMs": 90.1
                }
            ]
        }
    },
    InvokeStartEvent:{
        "time": "2022-10-12T00:00:15.064Z",
        "type": "platform.start",
        "record": {
            "requestId": "6d68ca91-49c9-448d-89b8-7ca3e6dc66aa",
            "version": "$LATEST",
            "tracing": {
                "spanId": "54565fb41ac79632",
                "type": "X-Amzn-Trace-Id",
                "value": "Root=1-62e900b2-710d76f009d6e7785905449a;Parent=0efbd19962d95b05;Sampled=1"
            }
        }
    },
    InvokeRuntimeDoneEvent:{
        "time": "2022-10-12T00:01:15.000Z",
        "type": "platform.runtimeDone",
        "record": {
            "requestId": "6d68ca91-49c9-448d-89b8-7ca3e6dc66aa",
            "status": "success",
            "tracing": {
                "spanId": "54565fb41ac79632",
                "type": "X-Amzn-Trace-Id",
                "value": "Root=1-62e900b2-710d76f009d6e7785905449a;Parent=0efbd19962d95b05;Sampled=1"
            },
            "spans": [
                {
                    "name": "someTimeSpan",
                    "start": "2022-08-02T12:01:23:521Z",
                    "durationMs": 80.0
                }
            ],
            "metrics": {
                "durationMs": 140.0,
                "producedBytes": 16
            }
        }
    },
    InvokeReportEvent:{
        "time": "2022-10-12T00:01:15.000Z",
        "type": "platform.report",
        "record": {
            "metrics": {
                "billedDurationMs": 694,
                "durationMs": 693.92,
                "initDurationMs": 397.68,
                "maxMemoryUsedMB": 84,
                "memorySizeMB": 128
            },
            "requestId": "6d68ca91-49c9-448d-89b8-7ca3e6dc66aa",
        }
    },
    RestoreStartEvent:{
        "time": "2022-10-12T00:00:15.064Z",
        "type": "platform.restoreStart",
        "record": {
            "runtimeVersion": "nodejs-14.v3",
            "runtimeVersionArn": "arn",
            "functionName": "myFunction",
            "functionVersion": "$LATEST",
            "instanceId": "82561ce0-53dd-47d1-90e0-c8f5e063e62e",
            "instanceMaxMemory": 256
        }
    },
    RestoreRuntimeDoneEvent:{
        "time": "2022-10-12T00:00:15.064Z",
        "type": "platform.restoreRuntimeDone",
        "record": {
            "status": "success",
            "spans": [
                {
                    "name": "someTimeSpan",
                    "start": "2022-08-02T12:01:23:521Z",
                    "durationMs": 80.0
                }
            ]
        }
    },
    RestoreReportEvent:{
        "time": "2022-10-12T00:00:15.064Z",
        "type": "platform.restoreReport",
        "record": {
            "status": "success",
            "metrics": {
                "durationMs": 15.19
            },
            "spans": [
                {
                    "name": "someTimeSpan",
                    "start": "2022-08-02T12:01:23:521Z",
                    "durationMs": 30.0
                }
            ]
        }
    },
    FunctionLogEvent:{
        "time": "2022-10-12T00:03:50.000Z",
        "type": "function",
        "record": "[INFO] Hello world, I am a function!"
    },
    ExtensionLogEvent:{
        "time": "2022-10-12T00:03:50.000Z",
        "type": "extension",
        "record": "[INFO] Hello world, I am an extension!"
    }
}

