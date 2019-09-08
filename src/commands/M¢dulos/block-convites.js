module.exports = (client, message, args, prefix) => {
    if (!message.member.hasPermission("ADMINISTRATOR", false, true, true)) {
        return message.reply("**Você não possui permissões para utilizar esse comando!**").catch(()=>{});
    }
    if (args.length < 1) {
        return noArgs(message, prefix);
    }
    if (args[0] === "on" || args[0] === "off") {
        switchStatus(message, args[0] === "on");
    } else {
        message.reply(`Comando inválido`).catch(()=>{});
    }
};

var noArgs = (message, prefix) => {
    const { guild } = require("database.js");
    guild.findById(message.guild.id, "config").lean()
        .then(guildEntry => {
            let status = false;
            if (guildEntry) {
                status = guildEntry.config.filtroInvites;
            } else {
                let newGuild = new guild({ _id: message.guild.id });
                newGuild.save().catch(console.error);
            }
            const { RichEmbed } = require("discord.js");
            let embed = new RichEmbed()
            .setTitle(`Filtro de Invites`)
            .addField(`Status`, `${status ? `<:yes:529635602283626516> Ligado` : `<:noswift:529635602292015134> Desligado`}\nUse \`${prefix}block-convites [on || off]\` para mudar`)
            .setColor("f781c6");
            message.channel.send(embed).catch(()=>{});
        })
        .catch(console.error);
};

var switchStatus = (message, newStatus) => {
    const { guild } = require("database.js");
    guild.findById(message.guild.id, "config")
        .then(guildEntry => {
            if (!guildEntry) {
                guildEntry = new guild({ _id: message.guild.id });
            }
            guildEntry.config.filtroInvites = newStatus;
            guildEntry.save()
                .then(() => {
                    const { RichEmbed } = require("discord.js");
                    let embed = new RichEmbed()
                    .setAuthor(message.author.username, message.author.displayAvatarURL)
                    .setDescription(`**Filtro de convites foi ${newStatus ? "<:yes:529635602283626516> ativado" : "<:noswift:529635602292015134> desativado"}!**`)
                    .setThumbnail("https://cdn.discordapp.com/emojis/533388024889868288.png?v=1")
                    .setColor("f781c6")
                    .setFooter(message.guild.name, message.guild.iconURL)
                    .setTimestamp();
                    message.channel.send(embed).catch(()=>{});
                })
                .catch(console.error);
        })
        .catch(console.error)
};
