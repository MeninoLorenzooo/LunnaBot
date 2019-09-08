module.exports = (client, message, args, guildTable) => {
    if (args.length < 2) {
        return message.reply("Você não especificou o canal!").catch(()=>{});
    }
    let mentionTest = /<#[0-9]{18}>/.test(args[1]) && args[1].length === 21;
    let idTest = /[0-9]{18}/.test(args[1]) && args[1].length === 18;
    if (!mentionTest && !idTest) {
        return message.reply("Canal inválido!").catch(()=>{});
    }
    let canalID = args[1].slice(args[1].length - 19, args[1].length - 1);
    let canal = message.guild.channels.get(canalID);
    if (!canal) {
        return message.reply("Canal inválido!").catch(()=>{});
    }
    guildTable.eventlog._id = canalID;
    guildTable.save()
        .then(() => {
            message.channel.send(`O canal <#${canalID}> foi definido com sucesso!`).catch(()=>{});
        })
        .catch(err => {
            console.log(err);
            message.reply("Erro").catch(()=>{});
        });
};
