module.exports = async (client, message, args) => {
    if(!message.member.hasPermission("BAN_MEMBERS", false, true, true)) {
        return message.reply("Desculpe, você não tem permissão de desbanir usuários neste servidor! <:noswift:529635602292015134>").catch(()=>{});
    }
    if (!message.guild.me.hasPermission("BAN_MEMBERS", false, true)) {
        return message.reply("Eu não tenho permissão para desbanir usuários nesse servidor. <:noswift:529635602292015134>").catch(()=>{});
    }
    if (args.length < 1) {
        return message.reply("Use o ID do usuário <:noswift:529635602292015134>").catch(()=>{});
    }
    var bUser;
    if (!/[\d]{18}/.test(args[0]) || args[0].length == 18) {
        bUser = args[0];
    } else {
        return message.reply("Use o ID do usuário <:noswift:529635602292015134>").catch(()=>{});
    }
    let bans = await message.guild.fetchBans();
    bUser = bans.get(bUser);
    if (!bUser) {
        return message.reply("O usuário não está banido <:noswift:529635602292015134>").catch(()=>{});
    }
    let bReason = args.slice(1).join(' ');
    let executor = `executor: ${message.author.tag}`;
    bReason = bReason ? `${bReason}, ${executor}` : `Motivo não informado, ${executor}`;
    message.guild.unban(bUser, {reason : bReason})
        .then(async banned => { 
            var user;
            if (typeof banned !== "string") {
                user = banned;
            } else {
                let auditLogs = await message.guild.fetchAuditLogs({type : "MEMBER_BAN_REMOVE", limit : 3}).catch(()=>{});
                let entries = auditLogs.entries.array();
                for (let i = 0; i < entries.length; ++i) {
                    if (entries[i].executor.id !== client.user.id) continue;
                    user = entries[i].target;
                    i = entries.length;
                }
            }
            message.channel.send(`${user} foi desbanido com sucesso! <:yes:529635602283626516>`).catch(()=>{});
        })
        .catch(err => {
            if (typeof err === "object" && err.message === "Unknown User") {
                message.reply("Usuário não encontrado").catch(()=>{});
            }
        });
};
