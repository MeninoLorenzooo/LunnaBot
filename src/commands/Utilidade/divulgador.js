module.exports = async (client, message) => {
    var user = message.mentions.users.first();
    if (!user) user = message.author;
    var targetInvites = await message.guild.fetchInvites().catch(()=>{});
    var invitesUses = 0;
    var text = "";
    const moment = require("moment");
    moment.locale("pt-BR");
    targetInvites.forEach(invite => {
        if (invite.inviter.id === user.id) {
            invitesUses += invite.uses;
            text += `**Convite Criado: ${moment(invite.createdAt).format("LL")}**\n`;
            text += `**${invite.url} Uso: ${invite.uses}**\n`;
        }
    });
    text += `\u200B\n**Servidor: ${message.guild.name}**`;
    const { RichEmbed } = require("discord.js");
    let embed = new RichEmbed()
    .setAuthor(user.username, user.displayAvatarURL)
    .setTitle(`Informações do divulgador: ${user.username}`)
    .addField("• Convites • <a:nhaw:519543601135353871>", text)
    .addField("• Membros Recrutados •", `────> ${invitesUses} <────`)
    .setThumbnail("https://cdn.discordapp.com/emojis/519479795780812804.gif?v=1")
    .setColor("f781c6")
    .setFooter(message.guild.name, message.guild.iconURL)
    .setTimestamp();
    message.channel.send(embed).catch(()=>{});
};
