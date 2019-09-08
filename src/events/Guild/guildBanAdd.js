module.exports = (client, banGuild, user) => {
    const { guild } = require("database.js");
    guild.findById(banGuild.id, "eventlog").lean()
        .then(guildTable => {
            if (!guildTable) {
                let newGuild = new guild({ _id: banGuild.id });
                newGuild.save().catch(console.error);
                return;
            }
            if (!guildTable.eventlog.ban) return;
            let channel = banGuild.channels.get(guildTable.eventlog._id);
            if (!channel) return;
            const { RichEmbed } = require("discord.js");
            let embed = new RichEmbed()
            .setAuthor(user.username, user.displayAvatarURL)
            .setTitle("Ban | Banido")
            .addField("Usuário:", user, true)
            .addField("Tag:", user.tag, true)
            .setColor("f781c6")
            .setThumbnail(user.displayAvatarURL)
            .setFooter(`ID: ${user.id}`, banGuild.iconURL)
            .setTimestamp();
            channel.send(embed).catch(()=>{});
        })
        .catch(console.error);
};
