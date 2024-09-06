import express from 'express';
import EventEmitter from 'node:events';

import { WebSocketServer } from "ws";

import { getLogger } from "../logger.js";
const logger = getLogger('admin-server');
let activeSocket = null;

class AdminServer extends EventEmitter {
    constructor() {
        super();
        logger.trace('Constructing...');

        const expressApp = express();
        expressApp.use('/console', express.static('static'));
        const httpServer = expressApp.listen(3000, () => {
            logger.info('Listening on http://localhost:3000/console');
        });

        // WebSockets
        const wsServer = new WebSocketServer({
            noServer: true,
            path: '/ws'
        });

        httpServer.on('upgrade', (req, socket, head) => {
            logger.trace('httpServer.on upgrade');
            wsServer.handleUpgrade(req, socket, head, (ws) => {
                wsServer.emit('connection', ws, req);
            });
        });

        wsServer.on('connection', (s)=>this.onWsConnection(s));
    }

    onWsConnection(socket) {
        logger.trace('onWsConnection');
        if (activeSocket) activeSocket.close();
        activeSocket = socket;
        activeSocket.on('error', logger.error);
        activeSocket.on('message', (m)=>this.onWsMessage(m));
        this.emit('connection');
    }

    onWsMessage(data) { 
        logger.trace('onWsMessage');
        const messageString = data.toString();
        let message;
        try {
            message = JSON.parse(messageString);
        } catch (e){
            return logger.warn('Failed to parse message. Dropping.');
        }
        
        // logger.debug({message});
        switch (message.type){
            case 'replyToNext':
            case 'replyToRuntimeNext':
            case 'sendTelemetryEvents':
                this.emit(message.type, message.payload);
                break;
            default: 
                logger.warn(`Unknown message type ${message.type}. Dropping`);
        }
    }

    pushExtensionState(state){
        logger.trace('pushExtensionState');
        this.sendWsMessage('extensionStateUpdate', state);
    }

    pushNotification(notification){
        logger.trace('pushNotification');
        this.sendMessage('notification', notification);
    }

    sendWsMessage(type, payload){
        logger.trace('sendWsMessage');
        const msg = { type, payload };
        if (activeSocket){
            activeSocket.send(JSON.stringify(msg));
        } else {
            logger.warn('No active socket. Message dropped.');
        }
    }
}

export default AdminServer;

