module.exports = async (client, message, args) => {
    var guild = message.guild;
    if (args[0]) {
        guild = client.guilds.get(args[0]);
        if (!guild) {
            return message.channel.send(`${client.getEmoji("erro404")} Não encontrei o servidor no banco de dados!`).catch(()=>{});
        }
    }
    if (guild.memberCount >= 250) guild = await guild.fetchMembers().catch(()=>{});
    const moment = require('moment');
    moment.locale('pt-BR');
    const { RichEmbed } = require("discord.js");
    let embed = new RichEmbed()
    .setAuthor(guild.name, guild.iconURL)
    .addField("• <:coroa:487745226136485889> Dono do Servidor", `<@${guild.owner.id}>`, true)
    .addField("• <a:visto:487745242640941069> ID do Dono", `\`${guild.owner.id}\``, true)
    .addField("• <:EmoteAtt:485912371412598785> Servidor criado em", `**${moment(guild.createdAt).format("LL")}**`, true)
    .addField("• <:servidor:487745232226746389> Servidor criado á", `**${moment().diff(guild.createdAt, "days")} Dias**`, true)
    .addField("• <:discord:487745231974825986> ID do servidor", `\`${guild.id}\``, true)
    .addField(`• <:buscar:487745224727068673>    Região`, guild.region, true)
    .addField("• <a:cursor:495599239758348288> Bot adicionado em", `**${moment(guild.me.joinedAt).format("LL")}**`, true)
    .addField("• <a:cursor:495599239758348288> Bot adicionado á", `**${moment().diff(guild.me.joinedAt, "days")} Dias**`, true)
    .addField(`• <:membros:487745227134861312> Total de Membros`, `\`${guild.memberCount}\` membros no servidor`, true)
    .addField("• <:link:487745232889446400> Total de Cargos:", `\`${guild.roles.size}\` roles`, true)
    .addField("• <:EmoteMembers2:491291936863420428> Total de Pessoas:", `${guild.members.filter(m => !m.user.bot).size} usuários`, true)
    .addField("• <a:bloblove:475826454492348425> Total de Bots:", `${guild.members.filter(m => m.user.bot).size} bots`, true)
    .addField("• <:texto:491225723219214338> Canais de texto:", `\`${guild.channels.filter(c => c.type === "text").size}\` canais de texto`, true)
    .addField("• <:sons:491225723332198401> Canais de Voz:", ` \`${guild.channels.filter(c => c.type === "voice").size}\` canais de voz`, true)
    .setThumbnail(`${guild.iconURL}?size=2048`)
    .setColor("f781c6");
    message.channel.send(embed).catch(()=>{});
};
