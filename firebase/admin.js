const admin = require("firebase-admin");
const mysql = require('mysql');
const serviceAccount = require("./service-account");

const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://cookeat-e828a.firebaseio.com"
});


const db = app.database();
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database : 'cookeat'
});

connection.connect();


//recipes
// const recipes = db.ref("recipes");
// connection.query("SELECT * FROM recipes", (error, results, fields) => {
//     results.forEach(result => {
//         recipes.push({
//             id: result.id,
//             title: result.Name,
//             description: result.Description,
//             image: result.Img
//         })
//     })
//
//     console.log("Completed recipes")
// });
//
//
//
// //ingredients
// const ingredients = db.ref("ingredients");
// connection.query("SELECT * FROM ingredients", (error, results, fields) => {
//     results.forEach(result => {
//         ingredients.push({
//             id: result.id,
//             title: result.Name
//         })
//     })
//     console.log("Completed ingredients")
// });
//
//
//
// //recipes ingredients
// const recipesIngredients = db.ref("recipes_ingredients");
// connection.query("SELECT * FROM recipes_ingredients", (error, results, fields) => {
//     results.forEach(result => {
//         recipesIngredients.push({
//             id: result.id,
//             ingredient_id: result.Ingredients_id,
//             recipe_id: result.Recipes_id,
//             quantity: result.Quantity,
//         })
//     })
//     console.log("Completed recipes_ingredients")
// });


// db.goOffline();
// connection.end();



