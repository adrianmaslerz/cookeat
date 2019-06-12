//core
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const cors = require('cors');
require('dotenv').config(); // VERY IMPORTANT TO LOAD THIS ASAP

//config
const database = require("./config/database");
const firebase = require("./config/firebase");
const variables = require("./config/variables");
const workers = require("./config/workers-manager");

//routes
const ApiRoutes = require('./routes/api');

//middlewares
//

class Server
{
	static bootstrap()
	{
		return new Server();
	}
	constructor()
	{
		//create express.js application
		this.app = express();

		//configure application
		this.config();

		//add routes
		this.routes();
	}
	routes()
	{
		//enabling namespace routes
		this.app.get("/", (req, res) => res.send(variables.app.name))
		ApiRoutes.load(this.app);

		// catch 404 and forward to error handler
		this.app.use(function(req, res, next)
		{
			let err = new Error('Page not found!');
			err.status = 404;

			next(err);
		});

		//error handler
		this.app.use(function(err, req, res, next)
		{
			// set locals, only providing error in development
			res.locals.message = err.message;
			res.locals.error = req.app.get('env') === 'development' ? err : {};

			// render the error page
			if(req.app.get('env') === 'development')
			{
				res.status(err.status || 500);
				res.render('error');
			}
			else
				res.status(err.status || 500).json({ errors : [ { field: "general", error: err.message } ]})
		});
	}
	config()
	{
		//logger middleware
		this.app.use(logger('dev'));

		//headers
		this.app.use(helmet());

		//CORS allow
		this.app.use(cors());

		// view engine setup
		this.app.set('views', path.join(__dirname, 'views'));
		this.app.set('view engine', 'pug');

		//static files
		this.app.use(express.static(path.join(__dirname, 'public')));

		//uncomment after placing your favicon in /public
		//this.app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

		//parsers
		this.app.use(bodyParser.json());
		this.app.use(bodyParser.urlencoded({ extended: false }));
		this.app.use(cookieParser());

		//express validator
		this.app.use(expressValidator({
			errorFormatter: (param, msg, value, location) => {
				return { field: param, message: msg }
			}
		}));

		//database
		database.load();

		//firebase
		firebase.load(this.app);
		firebase.index(this.app)

		//workers
		workers.load(this.app);
	}
}

module.exports = Server.bootstrap();
