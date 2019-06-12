
//services
const Utils = require('../../services/utilities');

//models
const { Ingredient } = require("../../models/Ingredient");

module.exports = class IngredientsController
{
    async getIngredients(req, res)
    {
		//params
		const search = req.query.search || "";
		const pattern = new RegExp("^.*" + search + ".*$");

		const results = await Ingredient.find({
				title: { $regex: pattern, $options: "i" },
			}, { id: 1, key: 1, title: 1 }
			).limit(50).exec();

        res.json({ results });
    }
}

