
//services
const Utils = require('../../services/utilities');

//models
const { Recipe } = require("../../models/Recipe");
const { Ingredient } = require("../../models/Ingredient");

module.exports = class RecipesController
{
    async getRecipes(req, res)
    {
		//params
		const search = req.query.search || "";
		const pattern = new RegExp("^.*" + search + ".*$");

		let ingredientKeys = [];
		try { ingredientKeys = Array.isArray(req.query["ingredients"]) ? req.query["ingredients"] : JSON.parse(req.query["ingredients"]) } catch (error) {}
		ingredientKeys = Array.isArray(ingredientKeys) ? ingredientKeys.filter(ingredientId => typeof ingredientId == "string") : [];
		const ingredients = ingredientKeys.length ? await Ingredient.find({ key: { $in: ingredientKeys }}).exec().catch(error => console.log("Invalid object id")) : [];


		const results = await Recipe.find({
				title: { $regex: pattern, $options: "i" },
				...(ingredients.length ? { ingredients: { $in: ingredients }} : undefined)
			}, { id: 1, key: 1, title: 1, description: 1, image: 1 }
			).limit(50).exec();

        res.json({ results });
    }
}

