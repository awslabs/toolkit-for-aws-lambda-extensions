const AWS_LAMBDA_RUNTIME_HOST = process.env.AWS_LAMBDA_RUNTIME_API;
const LOCAL_LAMBDA_RUNTIME_HOST = 'localhost:9001';

const AWS_LAMBDA_LISTENER_HOST = 'sandbox.localdomain';
const LOCAL_LISTENER_HOST = '0.0.0.0';

class Environment {

    static IS_RUNNING_ON_AWS = (AWS_LAMBDA_RUNTIME_HOST);

    static LAMBDA_RUNTIME_API = (this.IS_RUNNING_ON_AWS) ? AWS_LAMBDA_RUNTIME_HOST:LOCAL_LAMBDA_RUNTIME_HOST;

    static LISTENER_HOST = (this.IS_RUNNING_ON_AWS) ? AWS_LAMBDA_LISTENER_HOST:LOCAL_LISTENER_HOST;

}

module.exports = {Environment};