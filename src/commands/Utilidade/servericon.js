module.exports = (client, message) => {
    let url = message.guild.iconURL || "https://loritta.website/assets/img/unknown.png";
    const { RichEmbed } = require("discord.js");
    let embed = new RichEmbed()
    .setTitle(message.guild.name)
    .setDescription(`Servidor: ${message.guild.name} ${message.guild.iconURL ? `: **[download](${message.guild.iconURL}?size=2048)**` : ""}`)
    .setColor("f781c6")
    .setImage(`${url}${message.guild.iconURL ? "?size=2048" : ""}`)
    .setFooter(message.guild.name, message.guild.iconURL)
    .setTimestamp();
    message.channel.send(embed).catch(()=>{});
};
