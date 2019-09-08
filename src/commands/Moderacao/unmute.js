module.exports = (client, message, args) => {
    if (!message.member.hasPermission("MANAGE_ROLES", false, true, true)) {
        return message.reply("Você não tem permissão para utilizar esse comando!").catch(()=>{});
    }
    if (!message.guild.me.hasPermission("MANAGE_ROLES", false, true)) {
        return message.reply("Não tenho permissão permissão para remover cargos").catch(()=>{});
    }
    var muteMember;
    if (message.mentions.members.size > 0) {
        if (/<@!?[\d]{18}>/.test(args[0]) && args[0].length <= 22) {
            muteMember = message.mentions.members.first();
        }
    } else if (/[\d]{18}/.test(args[0]) && args[0].length === 18) {
        muteMember = message.guild.members.get(args[0]);
    }
    if (!muteMember) {
        return message.reply("Mencione alguém do servidor ou use o ID").catch(()=>{});
    }
    let muteRole = muteMember.roles.find(r => r.name === "Lunna Mute");
    if (!muteRole) {
        return message.reply("O usuário não está mutado").catch(()=>{});
    }
    muteMember.removeRole(muteRole)
        .then(member => {
            let guildEntry = client.mutes[message.guild.id];
            if (!guildEntry) return;
            let memberEntry = guildEntry[member.id];
            if (!memberEntry) return;
            clearTimeout(memberEntry.timeoutID);
            const moment = require("moment");
            const ms = require("ms");
            let tempoDecorrido = ms(moment().diff(memberEntry.timestamp, "s") * 1000);
            message.reply(`Membro ${member} desmutado, tempo decorrido: ${tempoDecorrido}`).catch(()=>{});
            delete guildEntry[member.id];
            if (Object.keys(guildEntry).length) return;
            delete client.mutes[message.guild.id];
        })
        .catch(() => {
            message.reply("Erro ao desmutar membro").catch(()=>{});
        });
};
