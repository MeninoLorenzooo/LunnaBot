module.exports = (client, message, args, prefix, guildTable) => {
    if (guildTable.contador._id === "") {
        return message.reply("Voce deve setar um canal primeiro <:noswift:529635602292015134>").catch(()=>{});
    }
    if (guildTable.contador.status === false) {
        return message.reply(`O contador já está off <:noswift:529635602292015134>`).catch(()=>{});
    }
    guildTable.contador.status = false;
    let oldChannel = guildTable.contador._id;
    guildTable.contador._id = "";
    guildTable.save()
        .then(() => {
            message.reply(`Status do contador setado para: off <:noswift:529635602292015134>`).catch(()=>{});
            let canal = message.guild.channels.get(oldChannel);
            if (!canal) return;
            canal.setTopic("", "Removendo contador").catch(()=>{});
        })
        .catch(error => {
            console.log(error);
            message.reply(`Erro`).catch(()=>{});
        });
};
