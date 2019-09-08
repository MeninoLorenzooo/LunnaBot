module.exports = (client, guildMember) => {
    const { guild } = require("database.js");
    guild.findById(guildMember.guild.id, "registradores contador welcome")
        .then(guildTable => {
            if (!guildTable) {
                let newGuild = new guild({ _id: guildMember.guild.id });
                newGuild.save().catch(console.error);
                return;
            }
            if (guildTable.contador.status) {
                client.emit("contador",  guildMember.guild, guildTable.contador);
            }
            let saidaChannel = guildMember.guild.channels.get(guildTable.welcome.saida._id);
            if (saidaChannel) {
                let message = guildTable.welcome.saida.text;
                message = message.replace(/\$\{USER\}/g, guildMember.user.tag);
                message = message.replace(/\$\{SERVER\}/g, guildMember.guild.name);
                saidaChannel.send(message).catch(()=>{});
            }
            let registradores = guildTable.registradores;
            for (let i = 0; i < registradores.length; ++i) {
                let registrados = registradores[i].membrosRegistrados;
                for (let j = 0; j < registrados.length; ++j) {
                    if (registrados[j]._id === guildMember.id) {
                        registrados.splice(j, 1);
                        return guildTable.save().catch(console.error);
                    }
                }
            }
        })
        .catch(console.error);
};
