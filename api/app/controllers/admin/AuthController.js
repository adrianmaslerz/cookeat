//models
const { Admin } = require("../../models/Admin");

//services
const AuthHandler = require('../../services/feature/AuthHandler');
const Utils = require('../../services/utilities');

module.exports = class AuthController
{
	async login(req, res)
	{
		AuthHandler
			.handleLogin(req, Admin)
			.then(response => res.json(response))
			.catch(error => res.status(error.code).json(Utils.parseStringError(error.message, error.field)));
	}

	async remindPassword(req, res)
	{
		AuthHandler
			.handlePasswordRemind(req, Admin)
			.then(() => res.json({ status: true }))
			.catch(error => res.status(error.code).json(Utils.parseStringError(error.message, error.field)));
	}

	async remindPasswordChange(req, res)
	{
		AuthHandler
			.handlePasswordRemindChange(req, Admin)
			.then(() => res.json({ status: true }))
			.catch(error => res.status(error.code).json(error.error ? Utils.parseValidatorErrors(error.error) : Utils.parseStringError(error.message, error.field)));
	}
}