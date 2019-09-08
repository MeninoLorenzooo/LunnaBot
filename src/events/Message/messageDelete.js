module.exports = (client, message) => {
    const moment = require("moment");
    var now = moment();
    if (!message.guild) return;
    const { guild } = require("database.js");
    guild.findById(message.guild.id, "eventlog").lean()
        .then(async guildTable => {
            if (!guildTable) {
                let newGuild = new guild({ _id: message.guild.id });
                newGuild.save().catch(console.error);
                return;
            }
            if (!guildTable.eventlog.delet) return;
            let channel = message.guild.channels.get(guildTable.eventlog._id);
            if (!channel) return;
            let guild = message.guild;
            let auditLogs = await guild.fetchAuditLogs({ limit: 1, type: "DELETE" }).catch(()=>{});
            var executor = message.author;
            auditLogs.entries.forEach(entry => {
                if (entry.action !== "MESSAGE_DELETE") return;
                if (moment(now).diff(entry.createdTimestamp, "ms") < 750) {
                    executor = entry.executor;
                }
            });
            let msg = message.content.replace(/`/g, "")
            if (msg.length + "```\n```".length > 1024) return;
            const { RichEmbed } = require("discord.js");
            let embed = new RichEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL)
            .setTitle("Mensagem | Apagada")
            .addField("Mensagem deletada:",
            `\`\`\`\n${msg}\`\`\`\n`)
            .addField(`Mensagem enviada por:`, message.author)
            .addField(`Canal:`, `${message.channel}`)
            .addField(`Deletada por:`, executor)
            .setColor("f781c6")
            .setFooter(`ID: ${message.author.id}`)
            .setTimestamp();
            channel.send(embed).catch(()=>{});
        })
        .catch(console.error);
};
