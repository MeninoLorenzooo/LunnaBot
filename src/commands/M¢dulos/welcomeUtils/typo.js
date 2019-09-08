module.exports = (client, message, prefix) => {
    const { RichEmbed } = require("discord.js");
    let embed = new RichEmbed()
    .setTitle("**Você digitou alguma coisa errada**")
    .setDescription(`digite: ${prefix}welcome`)
    .setColor("f781c6")
    .setFooter("Niko By Lunna", client.user.displayAvatarURL)
    .setTimestamp();
    message.channel.send(embed).catch(()=>{});
};
