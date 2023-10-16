import validateEnv from './utils/envValidator.js';
import App from './app.js';

validateEnv();

const app = new App();

app.listen();
