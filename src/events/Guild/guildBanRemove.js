module.exports = (client, unbanGuild, user) => {
    const { guild } = require("database.js");
    guild.findById(unbanGuild.id, "eventlog").lean()
        .then(guildTable => {
            if (!guildTable) {
                let newGuild = new guild({ _id: unbanGuild.id });
                newGuild.save().catch(console.error);
                return;
            }
            if (!guildTable.eventlog.unban) return;
            let channel = unbanGuild.channels.get(guildTable.eventlog._id);
            if (!channel) return;
            const { RichEmbed } = require("discord.js");
            let embed = new RichEmbed()
            .setAuthor(user.username, user.displayAvatarURL)
            .setTitle("Ban | Removido")
            .addField("Usuário:", user)
            .addField("Tag:", user.tag)
            .setColor("f781c6")
            .setThumbnail(user.displayAvatarURL)
            .setFooter(`ID: ${user.id}`, unbanGuild.iconURL)
            .setTimestamp();
            channel.send(embed).catch(()=>{});
        })
        .catch(console.error);
};
