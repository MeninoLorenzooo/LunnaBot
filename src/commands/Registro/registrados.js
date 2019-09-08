module.exports = (client, message) => {
    const { guild } = require("database.js");
    guild.findById(message.guild.id, "registradores").lean()
        .then(guildTable => {
            let obj = {
                m: 0,
                f: 0,
                n: 0,
                memberCount: message.guild.memberCount
            };
            if (guildTable) {
                guildTable.registradores.forEach(registrador => {
                    registrador.membrosRegistrados.forEach(membro => {
                        if (membro.genero === "M") ++obj.m;
                        if (membro.genero === "F") ++obj.f;
                        if (membro.genero === "N") ++obj.n;
                    });
                });
            } else {
                let newGuild = new guild({ _id: message.guild.id });
                newGuild.save().catch(console.error);
            }
            const { RichEmbed } = require("discord.js");
            let embed = new RichEmbed()
            .setTitle("<a:carregando:487622785443561473> Registros do servidor:")
            .setDescription(
                `Masculino: ${obj.m}\nFeminino: ${obj.f}\nNão binário: ${obj.n}\n\n` +
                `Total de usuários registrados: ${obj.m + obj.f + obj.n}\n` +
                `Total de usuários sem registros: ${obj.memberCount - (obj.m + obj.f + obj.n)}`
            )
            .setColor("f781c6")
            .setFooter(message.guild.name, message.guild.iconURL)
            .setTimestamp();
            message.channel.send(embed).catch(()=>{});
        })
        .catch(console.error);
};
