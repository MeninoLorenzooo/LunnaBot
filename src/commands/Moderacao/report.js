module.exports = (client, message, args) => {
    return;
    if(!message.member.hasPermission("BAN_MEMBERS", false, true, true)) {
        return;
    }
    if (!message.guild.me.hasPermission(["BAN_MEMBERS", "MANAGE_ROLES"], false, true)) {
        return message.reply("Preciso da permissão `BAN_MEMBERS` e `MANAGE_ROLES` para isso").catch(()=>{});
    }
    if (args.length < 1) {
        return message.reply("Mencione alguém ou use o ID").catch(()=>{});
    }
    var bMember;
    if (message.mentions.members.size > 0) {
        if (/<@!?[\d]{18}>/.test(args[0]) && args[0].length <= 22) {
            bMember = message.mentions.members.first();
        }
    } else if (/[\d]{18}/.test(args[0]) && args[0].length === 18) {
        bMember = message.guild.members.get(args[0]);
    }
    if (!bMember) {
        return message.reply("Mencione alguém do servidor ou use o ID").catch(()=>{});
    }
    if (bMember.user.bot) {
        return message.reply("**Você não pode reportar um bot!**").catch(()=>{});
    }
    if (bMember.id === message.guild.ownerID) {
        return message.reply("Você não tem permissão para punir este usuário").catch(()=>{});
    }
    let executorRole = message.member.highestRole;
    let targetRole = bMember.highestRole;
    if (executorRole.comparePositionTo(targetRole) <= 0 && message.author.id !== message.guild.ownerID) {
        message.reply("Você não pode punir este usuário, seu cargo é menor ou igual a o do usuário a ser punido!")
            .catch(()=>{});
        return;
    }
    let clientRole = message.guild.me.highestRole;
    if (clientRole.comparePositionTo(targetRole) <= 0) {
        return message.reply("Não tenho permissão para punir este usúario").catch(()=>{});
    }
};
