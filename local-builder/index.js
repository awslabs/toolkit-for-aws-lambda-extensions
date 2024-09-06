import { getLogger } from './lib/logger.js';
const logger = getLogger('lambda-extensions-local-builder');
logger.info('Starting...')

import servers from './lib/servers/servers.js'
servers.bootstrap();
