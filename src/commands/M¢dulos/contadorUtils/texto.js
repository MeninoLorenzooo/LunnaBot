module.exports = (client, message, args, prefix, guildTable) => {
    if (args.length < 2) {
        guildTable.contador.text = "";
        guildTable.save()
            .then(() => {
                message.reply("Texto removido").catch(()=>{});
                client.emit("contador", message.guild, guildTable.contador);
            })
            .catch(console.error);
        return;
    }
    if (guildTable.contador.status === false) {
        return message.reply("<:yes:529635602283626516> Você não definiu o canal do contador!").catch(()=>{});
    }
    guildTable.contador.text = args.slice(1).join(' ');
    guildTable.save()
        .then(() => {
            message.reply("<:yes:529635602283626516> Você definiu a mensagem com sucesso!").catch(()=>{});
            client.emit("contador", message.guild, guildTable.contador);
        })
        .catch(console.error);
};
