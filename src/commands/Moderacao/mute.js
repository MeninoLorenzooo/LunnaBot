module.exports = (client, message, args, prefix) => {
    if (!message.member.hasPermission("MANAGE_ROLES", false, true, true)) {
        return message.reply("Você não tem permissão para utilizar esse comando!").catch(()=>{});
    }
    if (!message.guild.me.hasPermission("MANAGE_ROLES", false, true)) {
        return message.reply("Não tenho permissão permissão para adicionar cargos").catch(()=>{});
    }
    var muteMember;
    if (message.mentions.members.size > 0) {
        if (/<@!?[\d]{18}>/.test(args[0]) && args[0].length <= 22) {
            muteMember = message.mentions.members.first();
        }
    } else if (/[\d]{18}/.test(args[0]) && args[0].length === 18) {
        muteMember = message.guild.members.get(args[0]);
    }
    if (!muteMember) {
        return message.reply("Mencione alguém do servidor ou use o ID").catch(()=>{});
    }
    let muteRole = message.guild.roles.find(r => r.name === "Lunna Muted");
    if (!muteRole) {
        if (!message.guild.me.hasPermission("MANAGE_CHANNELS", false, true)) {
            return message.reply("Não tenho permissão para bloquear o cargo de mute nos canais").catch(()=>{});
        }
        message.guild.createRole({ name: "Lunna Muted", permissions: []})
            .then(role => {
                message.guild.channels.forEach(channel => {
                    channel.overwritePermissions(role, {
                        SEND_MESSAGES: false,
                        ADD_REACTIONS: false,
                        SPEAK: false
                    }).catch(()=>{});
                });
                message.reply("**Criei a tag: `Lunna Muted` no servidor, Use o comando novamente!**").catch(()=>{});
            })
            .catch(() => {
                message.reply("Erro ao criar o cargo `Lunna Muted`").catch(()=>{});
            });
        return;
    }
    if (muteMember.roles.find(r => r.name === "Lunna")) {
        return message.reply(`O membro ${muteMember} já está mutado`).catch(()=>{});
    }
    if (args.length < 2) {
        return message.reply(`Exemplo de uso: \`${prefix} mute @Niko#0008 5m <Motivo>\``).catch(()=>{});
    }
    const ms = require("ms");
    let time = ms(args[1]);
    if (!time || time < ms("5m")) {
        return message.reply("Tempo mínimo de mute: `5m`").catch(()=>{});
    }
    if (time > ms("7h")) {
        return message.reply("Tempo máximo de mute: `7h`").catch(()=>{});
    }
    let reason = args.slice(2).join(' ');
    if (reason.length < 1) {
        reason = `Executor: ${message.author}, motivo não informado`;
    }
    muteMember.addRole(muteRole, reason)
        .then(() => {
            message.channel.send(`Membro ${muteMember} mutado por ${ms(time)}`);
            var timeoutID = setTimeout(() => {
                if (!muteMember.roles.find(r => r.name === `Lunna`)) return;
                muteMember.removeRole(muteRole, `Desmutando após ${ms(time)}`).catch(() => {
                    message.channel.send(`${message.author}, Não pude desmutar ${muteMember}, tempo de mute: ${ms(time)}`).catch(()=>{});
                });
                let guildEntry = client.mutes[message.guild.id];
                if (!guildEntry) return;
                delete guildEntry[muteMember.id];
                if (Object.keys(guildEntry).length) return;
                delete client.mutes[message.guild.id];
            }, time);
            if (!client.mutes[message.guild.id]) client.mutes[message.guild.id] = {};
            let guildEntry = client.mutes[message.guild.id];
            let timestamp = message.createdTimestamp;
            guildEntry[muteMember.id] = { time, timeoutID, timestamp};
        })
        .catch(() => {
            message.reply("Erro ao mutar usuário").catch(()=>{});
        });
};
