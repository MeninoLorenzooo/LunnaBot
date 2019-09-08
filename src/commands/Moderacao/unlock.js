module.exports = (client, message) => {
    if (!message.member.hasPermission("MANAGE_CHANNELS", false, true, true)) {
        return message.reply("Você não tem permissão para utilizar esse comando! <:noswift:529635602292015134>").catch(()=>{});
    }
    if (!message.guild.me.hasPermission("MANAGE_CHANNELS", false, true)) {
        return message.reply("Não tenho permissão para desbloquear os canais! <:noswift:529635602292015134>").catch(()=>{});
    }
    message.channel.overwritePermissions(message.guild.id, { SEND_MESSAGES: true})
        .then(() => message.channel.send(`O canal ${message.channel} foi desbloqueado com sucesso! <:yes:529635602283626516>`))
        .catch(()=>{});
};
