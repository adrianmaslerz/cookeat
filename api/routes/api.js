//services
const AppRouter = require('../app/services/core/AppRouter');

//controllers
const RecipesController = require('../app/controllers/api/RecipesController');
const IngredientsController = require('../app/controllers/api/IngredientsController');


const path = "/api";
const routes = [

	//Recipes
	{
		path: "/recipes", controller: RecipesController, children: [
			{ path: "/", method: "get", function: "getRecipes"}
		]
	},

	//Ingredients
	{
		path: "/ingredients", controller: IngredientsController, children: [
			{ path: "/", method: "get", function: "getIngredients"}
		]
	},
];

module.exports.load = function(app)
{
	//create routes
	let appRouter = new AppRouter();
	appRouter.create(routes);

	app.use(path, appRouter.router);
}


