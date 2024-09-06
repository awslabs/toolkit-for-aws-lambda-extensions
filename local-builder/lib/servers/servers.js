import { getLogger } from '../logger.js'
const logger = getLogger('servers');

import LambdaApiServer from './lambda-api-server.js';
import AdminServer from './admin-server.js'

const bootstrap = () => {
    logger.trace('Bootstrappping...');
    const lambdaApiServer = new LambdaApiServer();
    const adminServer = new AdminServer();
    
    adminServer.on('connection', ()=>{
        logger.trace('adminServer.on connection')
        const extensionState = lambdaApiServer.getExtensionState();
        adminServer.pushExtensionState(extensionState);
    });

    adminServer.on('replyToNext', (p)=>lambdaApiServer.replyToNext(p));
    adminServer.on('replyToRuntimeNext', (p)=>lambdaApiServer.replyToRuntimeNext(p));
    adminServer.on('sendTelemetryEvents', (e)=>lambdaApiServer.sendTelemetryEvents(e));

    lambdaApiServer.on('stateUpdate', (state)=>{
        logger.trace('lambdaApiServer.on stateUpdate')
        adminServer.pushExtensionState(state);
    });
}

export default {bootstrap};

