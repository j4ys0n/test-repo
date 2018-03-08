import * as express from 'express';
import * as compression from 'compression';
import * as session from 'express-session';
import * as bodyParser from 'body-parser';
import * as logger from 'morgan';
import * as errorHandler from 'errorhandler';
import * as lusca from 'lusca';
import * as dotenv from 'dotenv';
import * as flash from 'express-flash';
import * as path from 'path';
import * as clear from 'clear-console';
import * as chalk from 'chalk';
import expressValidator = require('express-validator');

let port = 80; // production

if (process.env.NODE_ENV !== 'production') {
	dotenv.config({ path: '.env' });
	clear({toStart: true});
	clear({toStart: true});
	port = 3000;
}

const app = express();

app.set('port', port);

app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
// app.use(session({
// 	resave: true,
// 	saveUninitialized: true,
// 	secret: process.env.SESSION_SECRET
// }));
app.use(flash());
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));

// API Routes imports
import ImagesAPIRoutes from './routes/api/image.routes';
// Initialization
ImagesAPIRoutes(app);

if (process.env.NODE_ENV === 'production') {
	app.use('/', express.static(path.join(__dirname, '..', 'public')));
	app.get('*', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'index.html')));
} else {
	console.log(path.join(__dirname, '..', 'public', 'index.html'));
	app.use('/', express.static(path.join(__dirname, '..', 'public')));
	app.get('*', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'index.html')));
}

app.use(errorHandler());

app.listen(app.get('port'), () => {
	console.info(chalk.green('Node server compiled succesfully!'));
	console.info('App is running at ' + chalk.bold('http://localhost:' + app.get('port')) + ' in ' + chalk.bold(app.get('env').toUpperCase()) + ' mode');
});

module.exports = app;
