import App from './app.js';

const app = new App();
app.initialize().then(app.listen.bind(app));
