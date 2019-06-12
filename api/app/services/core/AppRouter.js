//core
const express = require('express');
const path = require('path');
const variables = require("../../../config/variables");

const AppRouter = class AppRouter
{
	constructor()
	{
		this.router = express.Router();
		this.controllers = [];
	}

	create(routes = [])
	{
		//creating controllers
		this.registerControllers(routes);
		this.registerRoutes(routes, this.router);
	}

	registerControllers(routes = [])
	{
		routes.forEach(route => {

			//creating controller
			if (route.controller && Object.keys(this.controllers).indexOf(route.controller.name) == -1)
			{
				let controller = route.controller;
				this.controllers[ route.controller.name ] = new controller();
			}
		});
	}

	registerRoutes(routes = [], router, controllerName = null)
	{
		routes.forEach(route => {

			//settings for route
			let controller = route.controller ? route.controller.name : controllerName || route.controller.name;

			//enabling route middlewares
			if(route.middlewares && route.middlewares.length)
				router.use(route.path, ...route.middlewares);

			//current level route
			if(route.method && route.path && route.function && !route.children)
				router[route.method](route.path, this.controllers[controller][route.function]);

			//group level route
			else if(route.children && route.children.length)
			{
				let subRouter = express.Router({ mergeParams: true });
				this.registerRoutes(route.children, subRouter, controller);

				router.use(route.path, subRouter);
			}
		});
	}

	registerDocumentation(prefix)
	{
		this.router.get('/documentation', (req, res) => res.sendFile(path.join(variables.folders.public + prefix, 'index.html')));
	}
}

module.exports = AppRouter;