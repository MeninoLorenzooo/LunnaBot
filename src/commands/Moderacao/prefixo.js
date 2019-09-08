module.exports = (client, message, args, retry = 0) => {
    if (retry > 1) return;
    if (!message.member.hasPermission("ADMINISTRATOR", false, true, true)) {
        return message.reply("Sem permissão para trocar o prefix").catch(()=>{});
    }
    if (args.length < 1) {
        return message.reply("Indique um prefixo").catch(()=>{});
    }
    if (args.length > 1) {
        return message.reply("O novo prefix não pode conter espaço => ` `").catch(()=>{});
    }
    let newPrefix = args[0];
    if (newPrefix.length > 4) {
        return message.reply("Número máximo de caracteres: 4").catch(()=>{});
    }
    const { guild } = require("database.js");
    guild.findById(message.guild.id, "prefix")
        .then(guildTable => {
            if (!guildTable) {
                guildTable = new guild({ _id: message.guild.id });
            }
            guildTable.prefix = newPrefix;
            guildTable.save()
                .then(() => {
                    const { RichEmbed } = require("discord.js");
                    let embed = new RichEmbed()
                    .setTitle("Prefix configurado!")
                    .setDescription(`Novo prefixo: ${newPrefix}`)
                    .setColor("f781c6");
                    message.channel.send(embed).catch(()=>{});
                })
                .catch(err => {
                    message.reply("Erro").catch(()=>{});
                    console.error(err);
                });
        })
        .catch(console.error);
};
