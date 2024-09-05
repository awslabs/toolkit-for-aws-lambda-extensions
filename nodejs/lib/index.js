/**
 * @module toolkit-for-aws-lambda-extensions
 */

const { Extension } = require('./extension/extension');
const { HttpListenerExtension } = require('./extension/http-listener-extension');
const { TelemetryExtension } = require('./telemetry/telemetry-extension');
const { ProxyExtension } = require('./proxy/proxy-extension');

module.exports = {Extension, HttpListenerExtension, TelemetryExtension, ProxyExtension};