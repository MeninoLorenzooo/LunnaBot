const agree = "✔";
const disagree = "✖";

module.exports = async (client, message) => {
    if (message.mentions.users.size === 0) {
        return message.reply("<:stop:487745223133364224> " + "| Por Favor Mencione o Membro Desejado!").catch(()=>{});
    }
    let kickmember = message.guild.member(message.mentions.users.first());
    if (!kickmember) {
        return message.reply("<:stop:487745223133364224> " + "| Este Usuário Esta Invalido!").catch(()=>{});
    }
    if (!message.author.hasPermission("KICK_MEMBERS")) {
        return message.reply("<:stop:487745223133364224> | Você Não Tem Permissão \"KICK_MEMBERS").catch(()=>{});
    }

    let msg = await message.channel.send("**Vote Agora Faltam (20 Segundos) <a:carregando:489775219339165703>**").catch(()=>{});
    await msg.react(agree).catch(()=>{});
    await msg.react(disagree).catch(()=>{});

    const reactions = await msg.awaitReactions(r => r.emoji.name === agree || r.emoji.name === disagree, { time: 20000 }).catch(()=>{});

    msg.delete().catch(()=>{});

    var NO_Count = reactions.get(disagree).count;
    var YES_Count = reactions.get(agree);

    if (YES_Count == undefined) {
        var YES_Count = 1;
    } else {
        var YES_Count = reactions.get(agree).count;
    }

    const { RichEmbed } = require("discord.js");
    var sumsum = new RichEmbed()
    .addField(
        "**Votos Encerrados: <a:carregando:487622785443561473>**", "----------------------------------------\n" +
        "**Total votos (Não.) <:stop:487745223133364224>**: " + `${NO_Count-1}\n` +
        "**Total votos (Sim.) <a:visto:487745242640941069>**: " + `${YES_Count-1}\n` +
        "----------------------------------------\n" +
        "**NOTE: Votos Necessários Para Kickar (3+) <a:visto:487745242640941069>**\n" +
        "----------------------------------------", true
    )
    .setThumbnail("https://cdn.discordapp.com/attachments/510459921054040065/513816362502848522/sona_lol__by_kawailemon-dau65ty.png")
    .setColor("0xc106df");

    await message.channel.send(sumsum).catch(()=>{});

    if (YES_Count >= 4 && YES_Count > NO_Count) {
        kickmember.kick()
            .then(member => {
                message.reply(`${member.user.username} Foi Kickado Com Sucesso!! <:EmoteHammer:491286302004871168>`).catch(()=>{});
            })
            .catch(()=>{});
    } else {
        message.channel.send("\n" + "**Seguro!**").catch(()=>{});
    }
};
