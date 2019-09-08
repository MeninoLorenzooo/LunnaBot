module.exports = async (client, message) => {
    var member = message.guild.member(message.author);
    let pUser = message.mentions.users.first();
    if (pUser) {
        let guilda = await message.guild.fetchMembers();
        member = guilda.members.get(pUser.id);
    } else {
        pUser = message.author;
    }
    const moment = require ("moment");
    moment.locale("pt-BR");
    const { RichEmbed } = require("discord.js");
    let embed = new RichEmbed()
    .setAuthor(pUser.username, pUser.displayAvatarURL)
    .setDescription("| Informações")
    .addField(`${client.getEmoji("programando")}__Nome:__`, `\`\`\`\n${pUser.username}\`\`\``, true)
    .addField(`✔ | ID`, `\`\`\`\n${pUser.id}\`\`\``, true)
    .addField(`🔎 | __Conta criada__`, `\`\`\`\n${moment(pUser.createdTimestamp).format("LL")}\`\`\``)
    .addField(`⏰ | Dias no Discord`, `\`\`\`\n${moment().diff(pUser.createdAt, "days")} dias\`\`\``)
    .addField(`📥 | Entrou no Server`, `\`\`\`\n${moment(member.joinedAt).format("LL")}\`\`\``)
    .addField(`⌛ | Dias no servidor`, `\`\`\`\n${moment().diff(member.joinedAt, "days")} Dias\`\`\``)
    .setColor("f781c6")
    .setThumbnail(pUser.displayAvatarURL)
    .setFooter(`${message.guild.name} - ${moment().format("LL")}`, message.guild.iconURL)
    .setTimestamp();
    message.channel.send(embed).catch(()=>{});
};
