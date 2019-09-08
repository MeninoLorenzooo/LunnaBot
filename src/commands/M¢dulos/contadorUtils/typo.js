module.exports = (client, message, prefix) => {
    const { RichEmbed } = require("discord.js");
    let embed = new RichEmbed()
    .setTitle("**<:noswift:529635602292015134> Você digitou alguma coisa errada <:noswift:529635602292015134>**")
    .setDescription(`digite: ${prefix}contador`)
    .setColor("f781c6")
    .setFooter("By Lunna", client.user.displayAvatarURL)
    .setTimestamp();
    message.channel.send(embed).catch(()=>{});
};
