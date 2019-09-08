module.exports = (client, message, prefix) => {
    const { RichEmbed } = require("discord.js");
    let embed = new RichEmbed()
    .setTitle("**Você digitou alguma coisa errada**")
    .setDescription(`digite: ${prefix}eventlog`)
    .setColor("f781c6")
    .setFooter("By Luna", client.user.displayAvatarURL)
    .setTimestamp();
    message.channel.send(embed).catch(()=>{});
};
