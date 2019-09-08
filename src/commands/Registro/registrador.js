module.exports = (client, message, args, prefix, retry = 0) => {
    if (retry > 1) return 0;
    if (!message.member.hasPermission("MANAGE_ROLES", false, true, true)) {
        return message.reply("O comando está disponível apenas para usuários STAFF. <:fazeroq:519479790781071361>").catch(()=>{});
    }
    let registrador = message.mentions.users.first() || message.author;
    const { guild } = require("database.js");
    guild.findById(message.guild.id, "registradores").lean()
        .then(async guildTable => {
            if (!guildTable) {
                guildTable = new guild({ _id: message.guild.id });
                await guildTable.save().catch(console.error);
            }
            var getEmoji = emoji => {
                return client.emojis.find(e => e.name === emoji);
            }
            let msg = await message.channel.send(`${getEmoji("lag")} Procurando registros... <a:nhaw:519543601135353871>`).catch(()=>{});
            let m = 0;
            let f = 0;
            let n = 0;
            if (guildTable.registradores.length) {
                let index = guildTable.registradores.findIndex(r => r._id === registrador.id);
                if (index >= 0) {
                    guildTable.registradores[index].membrosRegistrados.forEach(member => {
                        if (member.genero === "M") ++m;
                        if (member.genero === "F") ++f;
                        if (member.genero === "N") ++n;
                    });
                }
            }
            const { RichEmbed } = require("discord.js");
            let embed = new RichEmbed()
            .setAuthor(`Registrador: ${registrador.username}`, registrador.displayAvatarURL)
            .setTitle("**<:s2:518062797423247380> Informações:**")
            .addField(`**${getEmoji("homi")} __Masculino__**`, `\`\`\`js\nRegistrou: ${m}\`\`\``)
            .addField(`**${getEmoji("muie")} __Feminino__**`, `\`\`\`js\nRegistrou: ${f}\`\`\``)
            .addField(`**:bust_in_silhouette:** __Não Binário__`, `\`\`\`js\nRegistrou: ${n}\`\`\``)
            .addField(`${getEmoji("sexy")} Registrou um:`, `\`\`\`js\nTotal de: ${f + m + n}\`\`\``)
            .setColor("f781c6");
            msg.edit(embed).catch(()=>{});
        })
        .catch(console.error);
};
