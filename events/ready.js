const { PREFIX } = require('../config.json');
const moment = require('moment');
const chalk = require("chalk")
const mongoose = require("mongoose");
module.exports.run =  (client)  => {
  mongoose.connect(process.env.mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    });
    let totalUsers = client.guilds.cache.reduce((users , value) => users + value.memberCount, 0);
    let totalGuilds = client.guilds.cache.size
    let totalChannels = client.channels.cache.size

    mongoose.connection.on("connected", () => {
    console.log(chalk.red`[${moment().format('YYYY-MM-DD HH:mm:ss')}] BOT:Mongoose has successfully connected!`);
  });
  // send msg if successfull connection to mongodb
  mongoose.connection.on("err", err => {
    console.error(`Mongoose connection error: \n${err.stack}`);
  });
  // send msg if error on connection
  mongoose.connection.on("disconnected", () => {
    console.warn("Mongoose connection lost");
  });
  //send msg if connection lost to mongodb

    console.log(chalk.red`[${moment().format('YYYY-MM-DD HH:mm:ss')}] BOT: Active, Commands Loaded!`);
    console.log(chalk.red`[${moment().format('YYYY-MM-DD HH:mm:ss')}] BOT: ${client.user.username} Logged In!`);
    client.user.setPresence({ activity: { name: "Anime", type: "WATCHING" }, status: "idle" });
    console.log(chalk.blue`[${moment().format('YYYY-MM-DD HH:mm:ss')}] BOT: Now ` + totalChannels + ` channels, ` + totalGuilds + ` Servers and ` + totalUsers + ` serving  users!`);
};
