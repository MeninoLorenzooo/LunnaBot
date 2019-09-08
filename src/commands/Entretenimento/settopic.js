module.exports = (client, message, args) => {
    message.delete().catch(()=>{});
    if (!message.member.hasPermission("MANAGE_CHANNELS", false, true, true)) {
        message.reply("**Você não possui permissões para utilizar esse comando!**").catch(()=>{});
        return;
    }
    if (!message.guild.me.hasPermission("MANAGE_CHANNELS", false, true, true)) {
        message.reply("**Não tenho permissão para alterar o tópico do canal!**").catch(()=>{});
        return;
    }
    let text = args.join(' ');
    if (!text.length) {
        message.reply("Você esqueceu de colocar a mensagem do tópico!").catch(()=>{});
        return;
    } else if (text.length > 1024) {
        message.reply(`O tópico só pode conter 1024 caracteres`).catch(()=>{});
        return;
    }
    message.channel.setTopic(text).then(() => {
        message.reply(`Você definiu a mensagem: **${text}** | no tópico do servidor!`).catch(()=>{});
    }).catch(()=>{});
};
