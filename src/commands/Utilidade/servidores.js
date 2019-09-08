module.exports = async (client, message) => {
    let string = '';
    bot.guilds.forEach(guild => {
        string += guild.name + '\n';
    });
    const { RichEmbed } = require("discord.js");
    let botembed = new RichEmbed()
        .setColor("0xf781c6")
        .addField(" Servidores:", string)
        .setTimestamp()
        .setFooter("Comando Requisatado por: " + message.author.username, message.author.avatarURL);
    message.channel.send(botembed).catch(()=>{});
};
