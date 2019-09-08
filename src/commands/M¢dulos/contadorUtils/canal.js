module.exports = (client, message, args, prefix, guildTable) => {
    if (args.length < 2) {
        return message.reply("Você não especificou o canal!").catch(()=>{});
    }
    let idTest = /[0-9]{18}/.test(args[1]);
    if (!idTest) {
        return message.reply("Canal inválido!").catch(()=>{});
    }
    let canalID = /[0-9]{18}/.exec(args[1])[0];
    let canal = message.guild.channels.get(canalID);
    let canalAntigo = message.guild.channels.get(guildTable.contador._id);
    if (!canal) {
        return message.reply("Canal inválido!").catch(()=>{});
    }
    guildTable.contador._id = canalID;
    guildTable.contador.status = true;
    guildTable.save()
        .then(() => {
            message.reply(`O canal ${canal} foi definido com sucesso!`).catch(()=>{});
            if (canalAntigo) {
                canalAntigo.setTopic("", "Removendo contador").catch(()=>{});
            }
            client.emit("contador", message.guild, guildTable.contador);
        })
        .catch(error => {
            console.log(error);
            message.reply(`Erro`).catch(()=>{});
        });
};
