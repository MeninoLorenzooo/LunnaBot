module.exports = async (client, message) => {
    message.delete().catch(()=>{});
    var user = message.mentions.users.first();
    if (!user) user = message.author;
    var targetInvites = await message.guild.fetchInvites().catch(()=>{});
    if (!targetInvites) return;
    var invitesUses = 0;
    targetInvites.forEach(invite => {
        if (invite.inviter.id === user.id) {
            invitesUses += invite.uses;
        }
    });
    const { RichEmbed } = require("discord.js");
    var embed = new RichEmbed()
    .setAuthor(user.tag, user.displayAvatarURL)
    .setThumbnail(user.displayAvatarURL)
    .addField("• Membros Recrutados •", `\`\`\`md\n# ${invitesUses} Membros\`\`\``)
    .setColor("4959E9")
    .setFooter(`ID: ${user.id}`)
    .setTimestamp();
    message.channel.send(embed).catch(()=>{});
};
