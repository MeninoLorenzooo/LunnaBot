module.exports = (client, message) => {
    if (!message.member.hasPermission("ADMINISTRATOR", false, true, true)) {
        return message.reply("O comando está disponível apenas para administradores. <:policia:518062799847424022>").catch(()=>{});
    }
    const { guild } = require("database.js");
    guild.findById(message.guild.id, "registradores")
        .then(guildTable => {
            if (!guildTable) {
                let newGuild = new guild({ _id: message.guild.id });
                newGuild.save().catch(console.error);
                return message.reply("O registro já está vazio").catch(()=>{});
            }
            guildTable.registradores = [];
            guildTable.save()
                .then(() => {
                    message.reply("Histórico de registros apagado <a:oiii:519479795780812804>").catch(()=>{});
                })
                .catch(err => {
                    console.log(err);
                    message.reply("Erro").catch(()=>{});
                });
        })
        .catch(console.error);
};
