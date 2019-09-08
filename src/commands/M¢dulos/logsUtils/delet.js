module.exports = (client, message, args, guildTable) => {
    if (args < 2) {
        return;
    }
    if (args[1] !== "on" && args[1] !== "off") {
        return;
    }
    guildTable.eventlog.delet = args[1] === "on";
    guildTable.save()
        .then(() => {
            if (args[1] === "on") {
                message.channel.send(`O log de mensagens deletadas foi habilitado sucesso!`).catch(()=>{});
            } else {
                message.channel.send(`O log de mensagens deletadas foi desabilitado sucesso!`).catch(()=>{});
            }
        })
        .catch(err => {
            console.log(err);
            message.reply("Erro").catch(()=>{});
        });
};
