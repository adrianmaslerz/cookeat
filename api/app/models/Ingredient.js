//core
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const mongoosePaginate = require('mongoose-paginate');
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate');

//schema
const schema = mongoose.Schema({
	id: {
		type: Number,
		required: [ true, "{PATH} is required." ],
		unique: true
	},
	key: {
		type: String,
		required: [ true, "{PATH} is required." ],
		trim: true,
		unique: true
	},
	title: {
		type: String,
		required: [ true, "{PATH} is required." ],
        trim: true,
	},
}, { usePushEach: true });

//statics
schema.statics.parse = function(recipe, req)
{
    return recipe;
}

schema.plugin(uniqueValidator, { message: 'The {PATH} has already been taken.' });
schema.plugin(mongoosePaginate);
schema.plugin(mongooseAggregatePaginate);

module.exports = { Ingredient: mongoose.model("Ingredient", schema) }
