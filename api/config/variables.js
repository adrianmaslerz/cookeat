//loading environment config
const env = process.env;

module.exports = {
	app: {
		name: env.APP_NAME
	},
	database: {
		host: env.DB_HOST || "localhost",
		port: env.DB_PORT || 27017,
		user: env.DB_USER || "",
		password: env.DB_PASSWORD || "",
		database: env.DB_DATABASE
	},
    services: {
        firebase: {
			key: env.FIREBASE_KEY,
            db_url: env.FIREBASE_URL,
			service_account: __dirname + "/../service-account.json"
        },
    },
	folders: {
		views: __dirname + "/../views",
		uploads: __dirname + "/../public/uploads",
		public: __dirname + "/../public",
	},
	paths: {
		folders: {
			uploads: "/uploads"
		}
	}
}
