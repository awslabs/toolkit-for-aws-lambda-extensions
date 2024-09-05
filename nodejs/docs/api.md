## Classes

<dl>
<dt><a href="#Event">Event</a></dt>
<dd><p>Encapsulate an external event received by the extension.
Note: Type property will only hold the first part of the event type, e.g. &quot;platform&quot; for &quot;platform.start&quot;.</p>
</dd>
<dt><a href="#ExtensionApi">ExtensionApi</a></dt>
<dd><p>Lambda Extension API client.</p>
<p> <a href="https://docs.aws.amazon.com/lambda/latest/dg/runtimes-extensions-api.html"> API Reference</a></p>
</dd>
<dt><a href="#Extension">Extension</a></dt>
<dd><p>This reference Extension implementation register the extension and keep pulling next event.
It can be used as a base class for other extensions.</p>
</dd>
<dt><a href="#HttpListenerExtension">HttpListenerExtension</a></dt>
<dd><p>Adds an HTTP listener to the reference Extension implementation.</p>
</dd>
<dt><a href="#HttpClient">HttpClient</a></dt>
<dd><p>Utility class to invoke HTTP endpoints.
This intends to centralize and abstract the lib/implementation.</p>
</dd>
<dt><a href="#HttpListener">HttpListener</a></dt>
<dd><p>Basic HTTP Listener Implementation.</p>
</dd>
<dt><a href="#HttpResponse">HttpResponse</a></dt>
<dd><p>Class representing an HTTP response.
The main purpose is to abstract HTTP client from the implementation</p>
</dd>
<dt><a href="#RuntimeApi">RuntimeApi</a></dt>
<dd><p>Lambda Runtime API client.</p>
<p><a href="https://docs.aws.amazon.com/lambda/latest/dg/runtimes-api.html"> API Reference</a></p>
</dd>
<dt><a href="#TelemetryApi">TelemetryApi</a></dt>
<dd><p>Lambda Telemetry API client.</p>
<p><a href="https://docs.aws.amazon.com/lambda/latest/dg/telemetry-api-reference.html"> API Reference</a></p>
</dd>
<dt><a href="#TelemetryExtension">TelemetryExtension</a></dt>
<dd></dd>
<dt><a href="#RegexHandlerMap">RegexHandlerMap</a></dt>
<dd><p>Utility class Map class using a Regex expression as key and handler function as value.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#HttpRequestHandler">HttpRequestHandler</a> ⇒ <code><a href="#HttpResponse">Promise.&lt;HttpResponse&gt;</a></code></dt>
<dd><p>Handler for HTTP Requests</p>
</dd>
</dl>

<a name="Event"></a>

## Event
Encapsulate an external event received by the extension.
Note: Type property will only hold the first part of the event type, e.g. "platform" for "platform.start".

**Kind**: global class  
<a name="new_Event_new"></a>

### new Event(type, data)

| Param | Type |
| --- | --- |
| type | <code>string</code> | 
| data | <code>any</code> | 

<a name="ExtensionApi"></a>

## ExtensionApi
Lambda Extension API client.

 [ API Reference](https://docs.aws.amazon.com/lambda/latest/dg/runtimes-extensions-api.html)

**Kind**: global class  

* [ExtensionApi](#ExtensionApi)
    * [.register(name, events)](#ExtensionApi+register) ⇒ <code>Promise.&lt;string&gt;</code>
    * [.next(extensionId)](#ExtensionApi+next) ⇒ <code>object</code>

<a name="ExtensionApi+register"></a>

### extensionApi.register(name, events) ⇒ <code>Promise.&lt;string&gt;</code>
Register the extension in the Lambda service.

**Kind**: instance method of [<code>ExtensionApi</code>](#ExtensionApi)  
**Returns**: <code>Promise.&lt;string&gt;</code> - extensionId  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 
| events | <code>Array.&lt;string&gt;</code> | 

<a name="ExtensionApi+next"></a>

### extensionApi.next(extensionId) ⇒ <code>object</code>
Executed when Lambda invokes the function handler

**Kind**: instance method of [<code>ExtensionApi</code>](#ExtensionApi)  
**Returns**: <code>object</code> - event  

| Param | Type |
| --- | --- |
| extensionId | <code>string</code> | 

<a name="Extension"></a>

## Extension
This reference Extension implementation register the extension and keep pulling next event.
It can be used as a base class for other extensions.

**Kind**: global class  

* [Extension](#Extension)
    * [.EventType](#Extension+EventType) : <code>Object</code>
    * [.extensionId](#Extension+extensionId) : <code>string</code>
    * [.events](#Extension+events) : <code>Set.&lt;String&gt;</code>
    * [.register()](#Extension+register)
    * [.pullEvents()](#Extension+pullEvents) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.bind(eventType, handler)](#Extension+bind)
    * [.beforeRegister()](#Extension+beforeRegister) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.afterRegister()](#Extension+afterRegister) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.run()](#Extension+run) ⇒ <code>Promise.&lt;void&gt;</code>

<a name="Extension+EventType"></a>

### extension.EventType : <code>Object</code>
Extension event types.

**Kind**: instance property of [<code>Extension</code>](#Extension)  
<a name="Extension+extensionId"></a>

### extension.extensionId : <code>string</code>
Extension unique identifier return during registration

**Kind**: instance property of [<code>Extension</code>](#Extension)  
<a name="Extension+events"></a>

### extension.events : <code>Set.&lt;String&gt;</code>
**Kind**: instance property of [<code>Extension</code>](#Extension)  
<a name="Extension+register"></a>

### extension.register()
Initialize the extension registering it with Lambda Service

**Kind**: instance method of [<code>Extension</code>](#Extension)  
<a name="Extension+pullEvents"></a>

### extension.pullEvents() ⇒ <code>Promise.&lt;void&gt;</code>
Retrieve events from Lambda Service and forward them to the event router.

**Kind**: instance method of [<code>Extension</code>](#Extension)  
<a name="Extension+bind"></a>

### extension.bind(eventType, handler)
Bind a handler to an event type.
Only handler is accepted for each event type. Multiple handlers for the same event type will be ignored.

Note: This method should be invoked prior to run(), otherwise the Extension can potentially lose events.

**Kind**: instance method of [<code>Extension</code>](#Extension)  

| Param | Type |
| --- | --- |
| eventType | <code>string</code> | 
| handler | <code>function</code> | 

<a name="Extension+beforeRegister"></a>

### extension.beforeRegister() ⇒ <code>Promise.&lt;void&gt;</code>
Lifecycle method executed before Extension registration.

**Kind**: instance method of [<code>Extension</code>](#Extension)  
<a name="Extension+afterRegister"></a>

### extension.afterRegister() ⇒ <code>Promise.&lt;void&gt;</code>
Lifecycle method executed before Extension registration.

**Kind**: instance method of [<code>Extension</code>](#Extension)  
<a name="Extension+run"></a>

### extension.run() ⇒ <code>Promise.&lt;void&gt;</code>
Start the extension.
Note: This method should be invoked after all the handlers are bound.

**Kind**: instance method of [<code>Extension</code>](#Extension)  
<a name="HttpListenerExtension"></a>

## HttpListenerExtension
Adds an HTTP listener to the reference Extension implementation.

**Kind**: global class  

* [HttpListenerExtension](#HttpListenerExtension)
    * [new HttpListenerExtension(port)](#new_HttpListenerExtension_new)
    * [.httpListener](#HttpListenerExtension+httpListener) : [<code>HttpListener</code>](#HttpListener)
    * [.listenerUrl](#HttpListenerExtension+listenerUrl) : <code>string</code>
    * [.beforeRegister()](#HttpListenerExtension+beforeRegister) ⇒ <code>Promise.&lt;void&gt;</code>

<a name="new_HttpListenerExtension_new"></a>

### new HttpListenerExtension(port)

| Param | Type |
| --- | --- |
| port | <code>number</code> | 

<a name="HttpListenerExtension+httpListener"></a>

### httpListenerExtension.httpListener : [<code>HttpListener</code>](#HttpListener)
**Kind**: instance property of [<code>HttpListenerExtension</code>](#HttpListenerExtension)  
<a name="HttpListenerExtension+listenerUrl"></a>

### httpListenerExtension.listenerUrl : <code>string</code>
**Kind**: instance property of [<code>HttpListenerExtension</code>](#HttpListenerExtension)  
<a name="HttpListenerExtension+beforeRegister"></a>

### httpListenerExtension.beforeRegister() ⇒ <code>Promise.&lt;void&gt;</code>
Starts the HTTP listener before registering the extension.

**Kind**: instance method of [<code>HttpListenerExtension</code>](#HttpListenerExtension)  
<a name="HttpClient"></a>

## HttpClient
Utility class to invoke HTTP endpoints.
This intends to centralize and abstract the lib/implementation.

**Kind**: global class  
<a name="HttpClient.invoke"></a>

### HttpClient.invoke(url, method, body, headers) ⇒ [<code>Promise.&lt;HttpResponse&gt;</code>](#HttpResponse)
**Kind**: static method of [<code>HttpClient</code>](#HttpClient)  

| Param | Type |
| --- | --- |
| url | <code>string</code> | 
| method | <code>string</code> | 
| body | <code>string</code> \| <code>object</code> | 
| headers | <code>object</code> | 

<a name="HttpListener"></a>

## HttpListener
Basic HTTP Listener Implementation.

**Kind**: global class  

* [HttpListener](#HttpListener)
    * [new HttpListener(host, port)](#new_HttpListener_new)
    * [.handlers](#HttpListener+handlers) : <code>Map.&lt;string, function()&gt;</code>
    * [.on(method, handler)](#HttpListener+on)
    * [.start()](#HttpListener+start) ⇒ <code>string</code>

<a name="new_HttpListener_new"></a>

### new HttpListener(host, port)

| Param | Description |
| --- | --- |
| host | server port |
| port | server host |

<a name="HttpListener+handlers"></a>

### httpListener.handlers : <code>Map.&lt;string, function()&gt;</code>
Map of HTTP method x Handlers.

**Kind**: instance property of [<code>HttpListener</code>](#HttpListener)  
<a name="HttpListener+on"></a>

### httpListener.on(method, handler)
Register a handler for a specific HTTP method.

If no response is returned, the request is will return statusCode 200 and empty body.

**Kind**: instance method of [<code>HttpListener</code>](#HttpListener)  

| Param | Type |
| --- | --- |
| method | <code>&#x27;GET&#x27;</code> \| <code>&#x27;HEAD&#x27;</code> \| <code>&#x27;POST&#x27;</code> \| <code>&#x27;PUT&#x27;</code> \| <code>&#x27;DELETE&#x27;</code> \| <code>&#x27;CONNECT&#x27;</code> \| <code>&#x27;OPTIONS&#x27;</code> \| <code>&#x27;TRACE&#x27;</code> \| <code>&#x27;PATCH&#x27;</code> | 
| handler | [<code>HttpRequestHandler</code>](#HttpRequestHandler) | 

<a name="HttpListener+start"></a>

### httpListener.start() ⇒ <code>string</code>
Start the HTTP server and return the listener URL.

**Kind**: instance method of [<code>HttpListener</code>](#HttpListener)  
**Returns**: <code>string</code> - listener URL  
<a name="HttpResponse"></a>

## HttpResponse
Class representing an HTTP response.
The main purpose is to abstract HTTP client from the implementation

**Kind**: global class  

* [HttpResponse](#HttpResponse)
    * [new HttpResponse(statusCode, body, headers)](#new_HttpResponse_new)
    * [.text()](#HttpResponse+text) ⇒ <code>string</code>
    * [.json()](#HttpResponse+json) ⇒ <code>object</code>

<a name="new_HttpResponse_new"></a>

### new HttpResponse(statusCode, body, headers)

| Param | Type |
| --- | --- |
| statusCode | <code>number</code> | 
| body | <code>string</code> \| <code>object</code> | 
| headers | <code>Map</code> \| <code>object</code> | 

<a name="HttpResponse+text"></a>

### httpResponse.text() ⇒ <code>string</code>
Returns the body of the response as text.

**Kind**: instance method of [<code>HttpResponse</code>](#HttpResponse)  
<a name="HttpResponse+json"></a>

### httpResponse.json() ⇒ <code>object</code>
Returns the body of the response as JSON.

**Kind**: instance method of [<code>HttpResponse</code>](#HttpResponse)  
<a name="RuntimeApi"></a>

## RuntimeApi
Lambda Runtime API client.

[ API Reference](https://docs.aws.amazon.com/lambda/latest/dg/runtimes-api.html)

**Kind**: global class  

* [RuntimeApi](#RuntimeApi)
    * [.next()](#RuntimeApi+next) ⇒ [<code>HttpResponse</code>](#HttpResponse)
    * [.response(requestId, response)](#RuntimeApi+response) ⇒ [<code>Promise.&lt;HttpResponse&gt;</code>](#HttpResponse)

<a name="RuntimeApi+next"></a>

### runtimeApi.next() ⇒ [<code>HttpResponse</code>](#HttpResponse)
Request Lambda an invocation event.

**Kind**: instance method of [<code>RuntimeApi</code>](#RuntimeApi)  
**Returns**: [<code>HttpResponse</code>](#HttpResponse) - response  
<a name="RuntimeApi+response"></a>

### runtimeApi.response(requestId, response) ⇒ [<code>Promise.&lt;HttpResponse&gt;</code>](#HttpResponse)
Sends function invocation response to Lambda.

**Kind**: instance method of [<code>RuntimeApi</code>](#RuntimeApi)  

| Param |
| --- |
| requestId | 
| response | 

<a name="TelemetryApi"></a>

## TelemetryApi
Lambda Telemetry API client.

[ API Reference](https://docs.aws.amazon.com/lambda/latest/dg/telemetry-api-reference.html)

**Kind**: global class  
<a name="TelemetryApi+subscribe"></a>

### telemetryApi.subscribe(extensionId, listenerUri, types)
Subscribe to the telemetry API.

**Kind**: instance method of [<code>TelemetryApi</code>](#TelemetryApi)  

| Param | Type | Description |
| --- | --- | --- |
| extensionId | <code>string</code> |  |
| listenerUri | <code>string</code> |  |
| types | <code>Array.&lt;string&gt;</code> | The types of telemetry that you want the extension to subscribe to.                           Must be one of: [TelemetryExtension.EventType.PLATFORM](TelemetryExtension.EventType.PLATFORM),                           [TelemetryExtension.EventType.FUNCTION](TelemetryExtension.EventType.FUNCTION), or                           [TelemetryExtension.EventType.EXTENSION](TelemetryExtension.EventType.EXTENSION). |

<a name="TelemetryExtension"></a>

## TelemetryExtension
**Kind**: global class  

* [TelemetryExtension](#TelemetryExtension)
    * [.EventType](#TelemetryExtension+EventType) : <code>Object</code>
    * [.subscribe(listenerUrl)](#TelemetryExtension+subscribe) ⇒ <code>Promise.&lt;void&gt;</code>

<a name="TelemetryExtension+EventType"></a>

### telemetryExtension.EventType : <code>Object</code>
The types of telemetry that you want the extension to subscribe to.

**Kind**: instance property of [<code>TelemetryExtension</code>](#TelemetryExtension)  
<a name="TelemetryExtension+subscribe"></a>

### telemetryExtension.subscribe(listenerUrl) ⇒ <code>Promise.&lt;void&gt;</code>
Subscribe the extension to the Telemetry API.

**Kind**: instance method of [<code>TelemetryExtension</code>](#TelemetryExtension)  

| Param |
| --- |
| listenerUrl | 

<a name="RegexHandlerMap"></a>

## RegexHandlerMap
Utility class Map class using a Regex expression as key and handler function as value.

**Kind**: global class  
<a name="RegexHandlerMap+getHandler"></a>

### regexHandlerMap.getHandler(path) ⇒ <code>Object</code>
**Kind**: instance method of [<code>RegexHandlerMap</code>](#RegexHandlerMap)  

| Param |
| --- |
| path | 

<a name="HttpRequestHandler"></a>

## HttpRequestHandler ⇒ [<code>Promise.&lt;HttpResponse&gt;</code>](#HttpResponse)
Handler for HTTP Requests

**Kind**: global typedef  
**Returns**: [<code>Promise.&lt;HttpResponse&gt;</code>](#HttpResponse) - response  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>string</code> | request body |
| properties | <code>object</code> | request properties |

