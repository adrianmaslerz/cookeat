
//models
const { User, statuses: UserStatuses } = require("../../models/Recipe");

//services
const Utils = require('../../services/utilities');
const FileHandler = require("../../services/core/FileHandler");

module.exports = class UsersController
{
    async getUsers(req, res)
    {
        //params
        const search = req.query.search || "";
        const pattern = new RegExp("^.*" + search + ".*$");
        const sort = req.query.sort;

        //preparing bounds dates
        let from = !isNaN(Date.parse(req.query.from))? new Date(req.query.from) : !isNaN(parseInt(req.query.from))? new Date(parseInt(req.query.from)) : false;
        let to = !isNaN(Date.parse(req.query.to)) ? new Date(req.query.to) : !isNaN(parseInt(req.query.to))? new Date(parseInt(req.query.to)) : false;

        if(from && to && from.getTime() > to.getTime())
        {
            const temp = to;
            to = from;
            from = temp;
        }

        const pipeline = [
            {
                $project: {
                    email: 1,
                    first_name: 1,
                    last_name: 1,
                    created: 1,
                    fullname: { $concat: [ '$first_name', " ", '$last_name' ] },
                }
            },
            {
                $match: {
                    $or:[
                        { email: { $regex: pattern, $options: "xi" } },
                        { first_name: { $regex: pattern, $options: "xi" } },
                        { last_name: { $regex: pattern, $options: "xi" } },
                        { fullname: { $regex: pattern, $options: "i" } },
                    ],
                }
            },
            {
                $project: {
                    email: 1,
                    first_name: 1,
                    last_name: 1,
                    created: 1,
                }
            },
        ];

        //filter by created
        if(from)
            pipeline[1].$match["$and"] = [ { created: { $gte: from } } ];
        if(to)
        {
            if(pipeline[1].$match["$and"])
                pipeline[1].$match["$and"].push({ created: { $lte: to } })
            else
                pipeline[1].$match["$and"] = [ { created: { $lte: to } } ];
        }

        //sorts
        const options = {};
        switch (sort)
        {
            case "createdASC":
            {
                options["sortBy"] = { created: 1 }
                break;
            }
            case "emailASC":
            {
                options["sortBy"] = { email: 1 }
                break;
            }
            case "emailDESC":
            {
                options["sortBy"] = { email: -1 }
                break;
            }
            default:
            {
                options["sortBy"] = { created: -1 }
                break;
            }
        }

        //pagination and parsing
        const paginated = await Utils.paginate(User, { query: User.aggregate(pipeline), options: options }, req, true);
        paginated.results.map(user => User.parse(user, req));

        res.json(paginated);
    }

    async getUser(req, res)
    {
        const user = await User.findById(req.params.id, {
            email: 1,
            first_name: 1,
            last_name: 1,
            profile_image: 1,
            created: 1,
            banned_until: 1,
            status: 1
        })
        .lean()
        .exec()
        .catch(error => console.log("Invalid object id"));

        //not found
        if(!user)
            return res.status(404).json(Utils.parseStringError("User not found", "user"));

        res.json(User.parse(user, req));
    }

    async updateUser(req, res)
    {
        const user = await User.findById(req.params.id).exec().catch(error => console.log("Invalid object id"));

        //not found
        if(!user)
            return res.status(404).json(Utils.parseStringError("User not found", "user"));

        //profile image upload
        const handler = new FileHandler(req, res);
        const filePath = await handler.handleSingleUpload("profile_image", "users/" + user._id, {
            allowedMimeTypes: [ "image/jpg", "image/jpeg", "image/png" ],
            fileToRemove: user.profile_image
        });

        user.set({
            email: req.body.email || user.email,
            profile_image: filePath || user.profile_image,
            first_name: req.body.first_name || user.first_name,
            last_name: req.body.last_name || user.last_name,
            banned_until: req.body.banned_until || user.banned_until,
            status: [ UserStatuses.ACTIVE, UserStatuses.BLOCKED ].includes(req.body.status) ? req.body.status : user.status
        });

        //saving user
        user
            .save()
            .then(() => res.json({ status: true }))
            .catch(error => res.status(406).json(Utils.parseValidatorErrors(error)));
    }

    async deleteUser(req, res)
    {
        const user = await User.findById(req.params.id).exec().catch(error => console.log("Invalid object id"));

        //not found
        if(!user)
            return res.status(404).json(Utils.parseStringError("User not found", "user"));

        //sending response
        res.json({ status: true })

        user.remove().catch(error => console.log(error));
    }
}
