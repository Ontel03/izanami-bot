const { token, mongo } = require("./config.json");
const Discord = require("discord.js");
const fs = require("fs");
const { Client } = require("discord.js");
const db = require("quick.db");
const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");
const { Database } = require("quickmongo");
let dd = require('discord-buttons-plugin');
const client = new Client({
    disableEveryone: "everyone",
    partials: ["REACTION", "MESSAGE", "CHANNEL"]
  });
let {
    awaitReply,
    resolveUser,
    getRandomString,
    send,
    emo,
    text,
    randomNumber,
    formating, emoji,
    translate
  } = require("./Functions.js"); //Files
const config = require("./config.json");

module.exports = client;

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.data = new Database(process.env.mongoURL);
client.queue = new Map();
client.vote = new Map();

//<Require Files>
  client.config = require("./emoji/emojis");
  client.discord = require("discord.js");
  client.db = require("quick.db");
  client.button = new dd(client)
  require("./index.js");
  require("./handlers/Level-Up.js")(client);
  require ("./handlers/command.js")(client)
 
//<New Client>
  client.data2 = client.data;
  client.emotes = client.config.emojis;
  client.resolveUser = resolveUser;
  client.awaitReply = awaitReply;
  client.random = getRandomString;
  client.send = send;
  client.count = emo;
  client.EEmoji = emoji;
  client.text = text;
  client.format = formating;
  client.translate = translate;
  
["command", "events"].forEach((handler) => {
  require(`./handlers/${handler}`)(client);
});

// Auto-Role is here!

client.on("guildMemberAdd", async(member)=>{
  const roleData = require("./database/guildData/autorole")
  const data = await roleData.findOne({
      GuildID: member.guild.id,
  }).catch(err=>console.log(err));
  
  if (data) {
      let role = data.Role;
      let arole = member.guild.roles.cache.get(role);
    if (role) {
      member.roles.add(arole)
    } else if (!role) {
        return;
    }
  } else if (!data) {
      return;
  }
});

/**
 * Anti-link is here!!
 */
const antilinkData = require('./database/guildData/antilink')
 client.on("message", async(message)=>{
  const antilink = await antilinkData.findOne({
    GuildID: message.guild.id
  })
  if (antilink) {
     if (message.content.match("https://") || message.content.match("discord.gg") || message.content.match("www.")) {
    message.delete();
    message.channel.send("No links allowed while anti-link is active!").then(msg=>{
    let time = '2s'
    setTimeout(function(){
    msg.delete();
  }, ms(time));
})
  } else {
    return;
  }
} else if (!antilink) {
  return;
}
});
/*
// Welcome Here!
const welcomeData = require("./database/guildData/welcome")
const welcomemsg = require("./database/guildData/joinmsg")
client.on(`guildMemberAdd`, async (member) => {

  const data = await welcomeData.findOne({
    GuildID: member.guild.id
  })

  if (data) {
    var channel = data.Welcome

    var data2 = await welcomemsg.findOne({
      GuildID: member.guild.id
    })
    if (data2) {
      var joinmessage = data2.JoinMsg;

      joinmessage = joinmessage.replace("{user.mention}", `${member}`)
      joinmessage = joinmessage.replace("{user.name}", `${member.user.tag}`)
      joinmessage = joinmessage.replace("{server}", `${member.guild.name}`)
      joinmessage = joinmessage.replace("{membercount}", `${member.guild.memberCount}`)

      let embed20 = new MessageEmbed()
        .setDescription(joinmessage)
        .setColor("GREEN")
      member.guild.channels.cache.get(channel).send(embed20);
    }
  } else if (data2) {
    return;
  } else if (!data) {
    return;
  }
})
client.on("guildMemberAdd", async (member) => {
  const data = await welcomeData.findOne({
    GuildID: member.guild.id
  })
  const data2 = await welcomemsg.findOne({
    GuildID: member.guild.id
  })
  if (data) {
    var channel = data.Welcome

    let embed200 = new MessageEmbed()
      .setTitle("Welcome")
      .setDescription(`${member}, Welcome to **${member.guild.name}**! We hope you like our Server! Enjoy Your Stay here!`)
      .setFooter(`We are now ${member.guild.memberCount} members`)
      .setColor("GREEN")

    if (!data2) {
      member.guild.channels.cache.get(channel).send(embed200)
    } else if (data2) {
      return;
    }
  } else if (!data)
*/
client.login(process.env.token);