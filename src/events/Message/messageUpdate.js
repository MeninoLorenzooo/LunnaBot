module.exports = (client, oldMessage, newMessage) => {
    if (!newMessage.guild) return;
    const { guild } = require("database.js");
    guild.findById(newMessage.guild.id, "eventlog").lean()
        .then(guildTable => {
            if (!guildTable) {
                let newGuild = new guild({ _id: newMessage.guild.id });
                newGuild.save().catch(console.error);
                return;
            }
            if (!guildTable.eventlog || !guildTable.eventlog.edit) return;
            if ((oldMessage === newMessage) || (oldMessage.content === "" || newMessage.content === "")) return;
            let channel = newMessage.guild.channels.get(guildTable.eventlog._id);
            if (!channel) return;
            let author = newMessage.author;
            let oldContent = oldMessage.content.replace(/`/g, "");
            let newContent = newMessage.content.replace(/`/g, "");
            if (oldContent.length + "```\n```".length > 1024) return;
            if (newContent.length + "```\n```".length > 1024) return;
            const { RichEmbed } = require("discord.js");
            let embed = new RichEmbed()
            .setTitle("**Acão | Mensagem Editada**")
            .setDescription(`${author} editou sua mensagem.`)
            .addField("Mensagem antiga:", `\`\`\`\n${oldContent}\`\`\``)
            .addField("Mensagem nova:", `\`\`\`\n${newContent}\`\`\``)
            .addField("Canal:", `${newMessage.channel}`)
            .setColor("f781c6")
            .setFooter(`ID: ${author.id}`, author.displayAvatarURL)
            .setTimestamp();
            channel.send(embed).catch(()=>{});
        })
        .catch(console.error);
};
