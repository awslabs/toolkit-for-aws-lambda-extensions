import log4js from 'log4js';

const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

const getLogger = (loggerName) => {
    const logger = log4js.getLogger(loggerName);
    logger.level = LOG_LEVEL;
    return logger;
};

export {getLogger};