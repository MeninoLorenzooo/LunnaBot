module.exports = (client, message, args, guildTable) => {
    if (args.length < 2) {
        return;
    }
    let text = args.slice(1).join(' ');
    guildTable.welcome.privado = text;
    guildTable.save()
        .then(() => {
            message.channel.send("A mensagem de DM foi configurada com sucesso!").catch(()=>{});
        })
        .catch(err => {
            console.log(err);
            message.reply("Erro").catch(()=>{});
        });
};
