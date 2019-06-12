
//core
const app = {}
const cron = require('node-cron');

//loading config
require('dotenv').config();

//connecting databases
require("./../../config/database").load();
require("./../../config/firebase").load(app);

//services
const NotificationHandler = require("./../services/feature/NotificationsHandler");

//observing reminders
let reminders = [];
app.firebase.db.ref("reminders").on("value", async snapshot => {
    reminders = [];
    snapshot.forEach(data => {
        reminders.push({ ...data.val(), key: data.key })
    })
});

//scheduling
cron.schedule('* * * * *', async () => {

    const handler = new NotificationHandler();
    const now = new Date()

    await Promise.all(reminders.map(async reminder => {

        const date = new Date(reminder.date);
//        console.log(date.getMinutes(), date.getHours())
        if(date.getHours() == now.getHours() && date.getMinutes() == now.getMinutes())
        {
            //getting user
            const user = (await app.firebase.db.ref("users/" + reminder.user_id).once("value")).val();
            if(user)
            {
                //getting recipe
                const recipe = await handler.chooseRecipe(reminder);
                if(recipe)
                    await handler.addNotification(user, recipe, reminder, app.firebase.db);
            }
        }
    }))
});


