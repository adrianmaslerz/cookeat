//services
const Utils = require('../../services/utilities');
const UsersHandler = require("./../../services/feature/UsersHandler");

//models
const { Admin } = require("../../models/Admin");

module.exports = class AdminController
{
	getProfile(req, res)
	{
		const admin = {
			_id: req.user._id,
			email: req.user.email,
			first_name: req.user.first_name,
			last_name: req.user.last_name
		}
		res.json(Admin.parse(admin, req));
	}

	updateProfile(req, res)
	{
		//updating admin
		req.user.set({
			email: req.body.email || req.user.email,
			first_name: req.body.first_name || req.user.first_name,
			last_name: req.body.last_name || req.user.last_name
		});

		req.user
			.save()
			.then(() => res.json({ status: true }))
			.catch(error => res.status(406).json(Utils.parseValidatorErrors(error)));
	}

	changePassword(req, res)
	{
		UsersHandler
			.handleChangePassword(req)
			.then(() => res.json({ status: true }))
			.catch(error => res.status(error.code).json(error.error ? Utils.parseValidatorErrors(error.error) : Utils.parseStringError(error.message, error.field)));
	}
}