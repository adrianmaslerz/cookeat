module.exports.parseValidatorErrors = function(error)
{
	const errorMessages = [];
	if(error)
	{
		const errors = error.errors;
		for(const key in errors)
		{
			let message = errors[key].message;
			if(message && errors[key].path)
			{
				message = (message.charAt(0).toUpperCase() + message.slice(1)).replace(/_|\./g,' ');
				message = message.slice(0, message.lastIndexOf(" ")) + ".";
				errorMessages.push({
					field: key,
					message: message
				})
			}
		}
	}

	return { errors: errorMessages };
}

module.exports.parseStringError = function(message, field = "general")
{
	return {
		errors: [{
			field: field,
			message: message
		}]
	};

}

//pagination
module.exports.paginate = function(model, params, request, aggregate = false)
{
	return new Promise(resolve => {

		//params
		const page = parseInt(request.query.page) > 0 ? parseInt(request.query.page) : 1;
		const results = parseInt(request.query.results) > 0 ? parseInt(request.query.results) : 10;

		params.options.limit = results;
		params.options.page = page;

		//resolving promise and preparing response
		(aggregate ? model.aggregatePaginate(params.query, params.options) : model.paginate(params.query, params.options))
			.then(paginationResponse => {

				const response = {
					page: page,
					results: paginationResponse.docs || paginationResponse.data,
					pages: paginationResponse.pages || paginationResponse.pageCount || 0,
					total: paginationResponse.total || paginationResponse.totalCount || 0
				}

				resolve(response);
			});
	})
};