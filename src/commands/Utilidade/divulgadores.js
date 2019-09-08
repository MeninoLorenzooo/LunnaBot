module.exports = async (client, message) => {
    message.delete().catch(()=>{});
    var invites = await message.guild.fetchInvites().catch(()=>{});
    if (invites.size < 1) {
        return message.reply("Nenhum convite no servidor").catch(()=>{});
    }
    var checkedUsers = new Map();
    invites.forEach(invite => {
        let user = checkedUsers.get(invite.inviter.id);
        if (!user) {
            user = invite.inviter;
            user.sum = 0;
            user.invites = 0;
            user.biggest = invite;
        } else {
            if (invite.uses > user.biggest.uses || (invite.uses === user.biggest.uses && invite.createdTimestamp > user.biggest.createdTimestamp)) {
                user.biggest = invite;
            }
        }
        user.sum += invite.uses;
        if (invite.uses > 0) user.invites += 1;
        checkedUsers.set(user.id, user);
        return;
    });
    var top = [];
    checkedUsers.forEach(user => {
        if (user.sum === 0) {
            checkedUsers.delete(user.id);
            return;
        }
        if (top.length === 0) {
            top[0] = user;
            checkedUsers.delete(user.id);
            return;
        }
        for (let i = 0; i < top.length; ++i) {
            if (user.sum > top[i].sum || (user.sum === top[i].sum && user.biggest.createdTimestamp > top[i].biggest.createdTimestamp)) {
                top.splice(i, 0, user);
                if (top.length > 5) top.pop();
                checkedUsers.delete(user.id);
                return;
            } else if (i === 5) {
                checkedUsers.delete(user.id);
                return;
            }
        }
        if (top.length < 5) top.push(user);
        checkedUsers.delete(user.id);
        return;
    });
    if (top.length < 1) {
        return message.reply("Nenhum convite com mais que 0 usos").catch(()=>{});
    }
    var gatinhoo = client.emojis.find(e => e.name === "gatinhoo");
    const { RichEmbed } = require("discord.js");
    let embed = new RichEmbed()
    .setTitle("Top 5 Divulgadores:")
    .setDescription(`**Os top 5 __Divulgadores__ do servidor __${message.guild.name}__.**`)
    .setThumbnail("https://cdn.discordapp.com/emojis/533045526623420437.png?v=1")
    .setColor("f781c6");
    var sum = 0;
    var numInvites = 0;
    top.forEach((user, index) => {
        sum += user.sum;
        numInvites += user.invites;
        var emoji;
        switch (index) {
            case 0:
                emoji = ":first_place:";
                break;
            case 1:
                emoji = ":second_place:"
                break;
            case 2:
                emoji = ":third_place:";
                break;
            case 3:
                emoji = client.emojis.find(e => e.name === "fourth_place");
                break;
            case 4:
                emoji = client.emojis.find(e => e.name === "fifth_place");
                break;
            default:
                emoji = "Erro";
                break;
        }
        embed.addField(`${emoji} __${user.username}:__`, `\`\`\`js\nConvidou: ${user.sum}\`\`\``);
    });
    let expInvite = numInvites !== 1;
    let expSum = sum !== 1;
    embed.addField("Isso dá um total de:", `<a:carregando:489775219339165703> \`${sum}\` usuário${expSum ? "s" : ""} recrutado${expSum ? "s" : ""}`, true)
    .addField(`Convites gerados`, ` <a:carregando:489775219339165703> \`${numInvites}\` convite${expInvite ? "s" : ""} gerado${expInvite ? "s" : ""}`, true);
    message.channel.send(embed).then(msg => msg.react(gatinhoo).catch(()=>{})).catch(()=>{});
};
