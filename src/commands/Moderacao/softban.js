module.exports = async (client, message, args) => {
    if(!message.member.hasPermission("BAN_MEMBERS", false, true, true)) {
        return message.reply("Desculpe, você não tem permissão de banir usuários neste servidor!").catch(()=>{});
    }
    if (!message.guild.me.hasPermission("BAN_MEMBERS", false, true)) {
        return message.reply("Eu não tenho permissão para banir usuários nesse servidor.").catch(()=>{});
    }
    if (args.length < 1) {
        return message.reply("Mencione alguém ou use o ID").catch(()=>{});
    }
    var bUser;
    if (message.mentions.members.size > 0) {
        if (/<@!?[\d]{18}>/.test(args[0]) && args[0].length <= 22) {
            bUser = message.mentions.members.first();
        }
    } else if (/[\d]{18}/.test(args[0]) && args[0].length === 18) {
        bUser = message.guild.members.get(args[0]) || args[0];
    } else {
        return message.reply("Mencione alguém do servidor ou use o ID").catch(()=>{});
    }

    if (typeof bUser !== "string") {
        if (bUser.id === message.guild.ownerID) {
            return message.reply("Você não tem permissão para banir este usuário").catch(()=>{});
        }
        if (bUser.id === client.user.id) {
            return message.reply("Não posso me banir").catch(()=>{});
        }
        let executorRole = message.member.highestRole;
        let targetRole = bUser.highestRole;
        if (executorRole.comparePositionTo(targetRole) <= 0 && message.author.id !== message.guild.ownerID) {
            return message.reply("Você não pode punir este usuário, seu cargo é menor ou igual a o do usuário a ser punido!")
                .catch(()=>{});
        }
        let clientRole = message.guild.me.highestRole;
        if (clientRole.comparePositionTo(targetRole) <= 0) {
            return message.reply("Não posso punir este usúario, meu cargo é menor ou igual a o do usuário a ser punido!")
                .catch(()=>{});
        }
    }
    let bReason = args.slice(1).join(' ');
    let executor = `executor: ${message.author.tag}`;
    bReason = bReason ? `${bReason}, ${executor}` : `Motivo não informado, ${executor}`;
    message.guild.ban(bUser, {reason : bReason, days: 7})
        .then(async banned => { 
            var user;
            if (typeof banned !== "string") {
                user = banned;
            } else {
                let auditLogs = await message.guild.fetchAuditLogs({type : "MEMBER_BAN_ADD", limit : 3}).catch(()=>{});
                let entries = auditLogs.entries.array();
                for (let i = 0; i < entries.length; ++i) {
                    if (entries[i].executor.id !== client.user.id) continue;
                    user = entries[i].target;
                    i = entries.length;
                }
            }
            let msg = await message.channel.send(`${user} foi banido com sucesso!`).catch(()=>{});
            message.guild.unban(user, "softban")
                .then(() => msg.edit(`${user} foi desbanido com sucesso!`))
                .catch(()=>{});
        })
        .catch(err => {
            if (typeof err === "object" && err.message === "Unknown User") {
                message.reply("Usuário não encontrado").catch(()=>{});
            }
        });
};
