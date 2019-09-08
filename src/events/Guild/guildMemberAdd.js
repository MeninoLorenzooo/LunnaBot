module.exports = (client, guildMember) => {
    const { guild } = require("database.js");
    guild.findById(guildMember.guild.id, "contador welcome config eventlog").lean()
        .then(guildTable => {
            if (!guildTable) {
                let newGuild = new guild({ _id: guildMember.guild.id });
                newGuild.save().catch(console.error);
                return;
            }
            contador(client, guildMember, guildTable);
            welcome(guildMember, guildTable);
            autorole(guildMember, guildTable);
            antibot(guildMember, guildTable);
            autoverificar(guildMember, guildTable);
        })
        .catch(console.error);
};

var contador = (client, guildMember, guildTable) => {
    if (guildTable.contador.status) {
        client.emit("contador", guildMember.guild, guildTable.contador);
    }
};

var welcome = (guildMember, guildTable) => {
    let welcomeChannel = guildMember.guild.channels.get(guildTable.welcome.welcome._id);
    if (welcomeChannel) {
        let message = guildTable.welcome.welcome.text;
        message = message.replace(/\$\{USER\}/g, guildMember);
        message = message.replace(/\$\{SERVER\}/g, guildMember.guild.name);
        welcomeChannel.send(message).catch(()=>{});
    }
    if (guildTable.welcome.privado.length) {
        let message = guildTable.welcome.privado;
        message = message.replace(/\$\{USER\}/g, guildMember);
        message = message.replace(/\$\{SERVER\}/g, guildMember.guild.name);
        guildMember.send(message).catch(()=>{});
    }
};

var autorole = (guildMember, guildTable) => {
    let autoRole = guildMember.guild.roles.get(guildTable.config.novato);
    if (autoRole) {
        guildMember.addRole(autoRole).catch(()=>{});
    }
};

var antibot = (guildMember, guildTable) => {
    if (guildMember.user.bot && guildTable.config.filtroBots.status) {
        guildMember.kick("Anti bot ativo!")
            .then(member => {
                let channel = member.guild.channels.get(guildTable.config.filtroBots._id)
                if (!channel) return;
                const { RichEmbed } = require("discord.js");
                let embed = new RichEmbed()
                .setTitle("Anti Bot | Kick")
                .addField("Bot", `\`${member.user.tag}\``)
                .addField("Motivo:", `Anti Bot ativo`)
                .setThumbnail(member.user.displayAvatarURL)
                .setColor("f781c6")
                .setTimestamp();
                channel.send(embed).catch(()=>{});
            })
            .catch(()=>{});
    }
};

var autoverificar = (guildMember, guildTable) => {
    if (!guildTable.config.autoVerificar.status) return;
    if (guildMember.user.bot) return;
    const moment = require("moment");
    let daysInDiscord = moment().diff(guildMember.user.createdTimestamp, "days", true);
    if (daysInDiscord < 5) {
        guildMember.ban("Auto-verificar, menos de 5 dias no discord")
            .then(member => {
                let channel = guildMember.guild.channels.get(guildTable.eventlog._id);
                if (!channel) return;
                if (!guildTable.eventlog.autoVerificar) return;
                const { RichEmbed } = require("discord.js");
                let embed = new RichEmbed()
                .setTitle("Auto-verificar | Ban")
                .addField("Usuário", `\`${member.user.tag}\``)
                .addField("Motivo:", `Menos de 5 dias no discord, (${Math.floor(daysInDiscord)} dias)`)
                .setThumbnail(member.user.displayAvatarURL)
                .setColor("f781c6")
                .setTimestamp();
                channel.send(embed).catch(()=>{});
            })
            .catch(()=>{});
    }
};
