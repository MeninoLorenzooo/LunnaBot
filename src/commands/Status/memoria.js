module.exports = (client, message) => {
    const { RichEmbed } = require("discord.js");
    const { totalmem } = require("os");
    let embed = new RichEmbed()
    .setDescription(
        `**${client.getEmoji("EmoteConfig")} Memoria em uso é de: ` +
        `[${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} / ${(totalmem() / 1024 / 1024).toFixed(2)} MB](https://www.google.com)**`
    )
    .setColor("f781c6");
    message.channel.send(embed).catch(()=>{});
};
