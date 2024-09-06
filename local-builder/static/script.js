let webSocket = null;

$(document).ready(async () => {
    bootstrapUI();
    connect();
    // $('#TelemetryApiTab').click();
});

const bootstrapUI = () => {
    $("#SendEventButton").click(onSendEventButtonClicked);
    $("#InvokeEventButton").click(onExtensionsApiEventTypeSelectChange);
    $("#ShutdownEventButton").click(onExtensionsApiEventTypeSelectChange);
    $("#ExtensionsApiEventJson").on('keyup', onExtensionsApiEventJsonChange);
    $('#ExtensionsApiEventJson').val(EVENT_INVOKE_TEMPLATE);
    $("#SendTelemetryButton").click(onSendTelemetryButtonClicked);

    $("#SendRuntimeEventButton").click(onSendRuntimeEventButton);
    $('#RuntimeApiEventJson').val(EVENT_INVOKE_NEXT_TEMPLATE);

    $('#SendFunctionEventButton').click(onSendFunctionEventButton);
    $('#FunctionApiEventJson').val(EVENT_FUNCTION_RESPONSE_TEMPLATE);
}

const connect = () => {
    console.log('connect');
    webSocket = new WebSocket('ws://localhost:3000/ws');
    webSocket.onopen = (e) => onWsOpen(e);
}

const onWsOpen = (event) => {
    console.log('onWsOpen');
    webSocket.onmessage = (m) => onWsMessage(m);
}

const onWsMessage = (messageEvent) => {
    console.log('onWsMessage');
    const message = JSON.parse(messageEvent.data);
    switch (message.type) {
        case 'extensionStateUpdate':
            onStateUpdateMessage(message.payload);
            break;
        default:
            console.warn(`Unknown message type ${message.type}. Dropping.`);
    }
}

const sendWsMessage = (type, payload) => {
    console.log('sendWsMessage');
    const message = {type, payload};
    if (webSocket) {
        webSocket.send(JSON.stringify(message));
    } else {
        logger.warn('No active socket. Message dropped.');
    }
}

const onStateUpdateMessage = (extensionState) => {
    console.log('onStateUpdateMessage');
    const extensionsApiState = extensionState.extensionsApi;
    const telemetryApiState = extensionState.telemetryApi;
    const runtimeApiState = extensionState.runtimeApi;

    $('#ExtensionName').text(extensionsApiState.extensionName || 'N/A');
    $('#ExtensionId').text(extensionsApiState.extensionId || 'N/A');
    $('#ExtensionFeatures').text(extensionsApiState.extensionFeatures || 'N/A');
    $('#SubscribedEvents').text(extensionsApiState.subscribedEvents || 'N/A');
    $('#ExtensionsApiStateMessage').text(extensionsApiState.message || 'N/A');

    $('#SubscribedToTelemetryApi').text(telemetryApiState.isSubscribed);
    $('#SubscribedTelemetryTypes').text(telemetryApiState.subscribedTelemetryTypes || 'N/A');
    $('#TelemetryDestinationUri').text(telemetryApiState.destinationUri || 'N/A');
    $('#TelemetryApiStateMessage').text(telemetryApiState.message || 'N/A');

    $('#RequestId').text(runtimeApiState.requestId || 'N/A');
    $('#RuntimeApiStateMessage').text(runtimeApiState.message || 'N/A');
    $('#RuntimeFunctionEventResponseJson').val(runtimeApiState.functionResponse);

    if (extensionsApiState.stateCode >= 200) {
        $('#ControlsContainer').removeClass('hidden');
    }

    if (extensionsApiState.stateCode === 300) {
        $('#ExtensionsApiTabPane button').attr('disabled', null);
    } else {
        $('#ExtensionsApiTabPane button').attr('disabled', 'disabled');
    }

    if (telemetryApiState.stateCode === 100) {
        $('#SendTelemetryButton').attr('disabled', 'disabled');
    } else {
        $('#SendTelemetryButton').attr('disabled', null);
        if ($('#TelemetryDestinationUriInput').val()) return;
        $('#TelemetryDestinationUriInput').val(telemetryApiState.destinationUri);
    }

    switch (runtimeApiState.stateCode) {
        case 100:
            $('#SendRuntimeEventButton').attr('disabled', 'disabled');
            $('#SendFunctionEventButton').attr('disabled', null);
            $('#FunctionInvocationNext').attr('disabled', null);
            $('#FunctionInvocationNext').prop('checked', true);
            $('#FunctionInvocationResponse').attr('disabled', 'disabled');
            $('#FunctionApiEventJson').hide();
            break;
        case 200:
            $('#SendRuntimeEventButton').attr('disabled', null);
            $('#SendFunctionEventButton').attr('disabled', 'disabled');
            $('#FunctionApiEventJson').hide();
            const autoResponse = $('#runtimeAutoResponse').is(':checked');
            if(autoResponse) onSendRuntimeEventButton();
            break;
        case 300:
            $('#SendRuntimeEventButton').attr('disabled', 'disabled');
            $('#SendFunctionEventButton').attr('disabled', null);
            $('#FunctionInvocationResponse').attr('disabled', false);
            $('#FunctionInvocationResponse').prop('checked', true);
            $('#FunctionInvocationNext').attr('disabled', 'disabled');
            $('#FunctionApiEventJson').show();
            break;
    }

}

const onSendEventButtonClicked = () => {
    console.log('onSendEventButtonClicked');
    const eventText = $("#ExtensionsApiEventJson").val();
    try {
        const payload = JSON.parse(eventText);
        sendWsMessage('replyToNext', payload)
    } catch (e) {
        alert('Invalid event JSON');
    }
}

const onSendRuntimeEventButton = () => {
    console.log('onSendRuntimeEventButton');
    const eventText = $("#RuntimeApiEventJson").val();
    try {
        const payload = JSON.parse(eventText);
        sendWsMessage('replyToRuntimeNext', payload)
    } catch (e) {
        alert('Invalid event JSON');
    }
}

const onSendFunctionEventButton = () => {
    console.log('onSendFunctionEventButton');
    const requestId = $('#RequestId').text();

    const extensionId = $('#ExtensionId').text();
    const payload = $('#FunctionApiEventJson').val();
    const host = $('#LambdaRuntimeUrl').val();
    const headers = {'Lambda-Extension-Identifier': extensionId};
    let url = `${host}/2018-06-01/runtime`;

    const eventType = $("input[name='FunctionInvocationTypeSelect']:checked").val();
    const functionEventResponse = $('#FunctionEventResponseJson');
    functionEventResponse.val('');
    switch (eventType) {
        case 'invocationNext':
            url += `/invocation/next`;
            $.ajax({
                url: url,
                method: 'GET',
                headers: headers,
                success: (data) => {
                    const response = JSON.stringify(data, null, 2);
                    functionEventResponse.val(response);
                },
                error: (xhr,status,error) => {
                    console.error(error);
                    functionEventResponse.val(error);
                },
            });
            break;
        case 'invocationResponse':
            url += `/invocation/${requestId}/response`;
            $.post(url, payload, (data, status) => {
                functionEventResponse.val(status);
            });
            break;
        default:
            throw new Error(`Unsupported event type: ${eventType}`);
    }
}

const onExtensionsApiEventTypeSelectChange = (event) => {
    const buttonId = $(event.target).attr('id');
    console.log('onExtensionsApiEventTypeSelectChange', buttonId);
    switch (buttonId) {
        case 'InvokeEventButton':
            $('#ExtensionsApiEventJson').val(EVENT_INVOKE_TEMPLATE);
            break;
        case 'ShutdownEventButton':
            $('#ExtensionsApiEventJson').val(EVENT_SHUTDOWN_TEMPLATE);
            break;
        default:
    }
}

const onExtensionsApiEventJsonChange = () => {
    console.log('onExtensionsApiEventJsonChange');
    try {
        const text = $('#ExtensionsApiEventJson').val();
        JSON.parse(text);
        $("#ExtensionsApiEventJsonValidation").text("✅ JSON OK");
    } catch (e) {
        $("#ExtensionsApiEventJsonValidation").text("❌ Invalid JSON");
    }
}

const onSendTelemetryButtonClicked = () => {
    console.log('onSendTelemetryButtonClicked');
    const eventTypes = [
        'SubscriptionEvent',
        'LogsDroppedEvent',
        'InitStartEvent',
        'InitRuntimeDoneEvent',
        'InitReportEvent',
        'InvokeStartEvent',
        'InvokeRuntimeDoneEvent',
        'InvokeReportEvent',
        'RestoreStartEvent',
        'RestoreRuntimeDoneEvent',
        'RestoreReportEvent',
        'FunctionLogEvent',
        'ExtensionLogEvent'
    ];

    const eventsToSend = [];

    for (const eventType of eventTypes) {
        const isChecked = $("#TAPI_" + eventType).is(':checked');
        if (isChecked) {
            eventsToSend.push(eventType);
        }
    }

    sendWsMessage('sendTelemetryEvents', eventsToSend);
}