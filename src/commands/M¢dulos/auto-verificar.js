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
        let match = /[0-9]{18}/.exec(args[0]);
        if (!match || !message.guild.channels.get(match[0])) {
            return message.reply(`Canal ou comando inválido`).catch(()=>{});
        }
        let [ id ] = match;
        setChannel(message, id);
    }
};

var noArgs = (message, prefix) => {
    const { guild } = require("database.js");
    guild.findById(message.guild.id, "config").lean()
        .then(guildEntry => {
            let canalID = "";
            let status = false;
            if (guildEntry) {
                canalID = guildEntry.config.autoVerificar._id;
                status = guildEntry.config.autoVerificar.status;
            } else {
                let newGuild = new guild({ _id: message.guild.id });
                newGuild.save().catch(console.error);
            }
            const { RichEmbed } = require("discord.js");
            let embed = new RichEmbed()
            .setTitle(`Auto-verificar`)
            .addField(`Canal de Logs`, `${canalID.length ? `<#${canalID}>` : `Não setado <:noswift:529635602292015134>`}\nUse \`${prefix}auto-verificar canal #monitoramento \` para mudar`)
            .addField(`Status`, `${status ? `<:yes:529635602283626516> Ligado` : `<:noswift:529635602292015134> Desligado`}\nUse \`${prefix}auto-verificar [on || off]\` para mudar`)
            .setThumbnail("https://cdn.discordapp.com/emojis/533388024889868288.png?v=1")
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
            guildEntry.config.autoVerificar.status = newStatus;
            guildEntry.save()
                .then(() => {
                    const { RichEmbed } = require("discord.js");
                    let embed = new RichEmbed()
                    .setAuthor(message.author.username, message.author.displayAvatarURL)
                    .setDescription(`**Auto-verificar ${newStatus ? "ligado" : "desligado"}**`)
                    .setColor("f781c6")
                    .setFooter(message.guild.name, message.guild.iconURL)
                    .setTimestamp();
                    message.channel.send(embed).catch(()=>{})
                })
                .catch(console.error);
        })
        .catch(console.error)
};

var setChannel = (message, channelID) => {
    const { guild } = require("database.js");
    guild.findById(message.guild.id, "config")
        .then(guildEntry => {
            if (!guildEntry) {
                guildEntry = new guild({ _id: message.guild.id });
            }
            guildEntry.config.autoVerificar._id = channelID;
            guildEntry.save()
                .then(() => {
                    const { RichEmbed } = require("discord.js");
                    let embed = new RichEmbed()
                    .setAuthor(message.author.username, message.author.displayAvatarURL)
                    .setDescription(`**Novo canal para logs do auto-verificar: <#${channelID}>**`)
                    .setColor("f781c6")
                    .setFooter(message.guild.name, message.guild.iconURL)
                    .setTimestamp();
                    message.channel.send(embed).catch(()=>{});
                })
                .catch(console.error)
        })
        .catch(console.error)
};
