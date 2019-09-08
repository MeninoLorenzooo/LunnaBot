module.exports = async (client, message, args) => {
    if(!message.member.hasPermission("BAN_MEMBERS", false, true, true)) {
        return;
    }
    if (!message.guild.me.hasPermission(["BAN_MEMBERS", "MANAGE_ROLES"], false, true)) {
        return message.reply("Preciso da permissão `BAN_MEMBERS` e `MANAGE_ROLES` para isso").catch(()=>{});
    }
    if (args.length < 1) {
        return message.reply("Mencione alguém ou use o ID").catch(()=>{});
    }
    var member;
    if (message.mentions.members.size > 0) {
        if (/<@!?[\d]{18}>/.test(args[0]) && args[0].length <= 22) {
            member = message.mentions.members.first();
        }
    } else if (/[\d]{18}/.test(args[0]) && args[0].length === 18) {
        member = message.guild.members.get(args[0]);
    }
    if (!member) {
        return message.reply("Mencione alguém do servidor ou use o ID").catch(()=>{});
    }
    let reason = args.slice(1).join(' ').slice(0, 201);
    if (!reason.length) {
        return message.reply("**Você esqueceu de colocar o motivo**").catch(()=>{});
    }
    if (checagem(message, member)) return;

    let toxico = message.guild.roles.find(r => r.name === "☢ Tóxico ☢");
    let adv2 = message.guild.roles.find(r => r.name === "advertência 2");
    let adv1 = message.guild.roles.find(r => r.name === "advertência 1");

    if (!toxico) toxico = await message.guild.createRole({ name: "☢ Tóxico ☢"}).catch(()=>{});
    if (!adv2) adv2 = await message.guild.createRole({ name: "advertência 2"}).catch(()=>{});
    if (!adv1) adv1 = await message.guild.createRole({ name: "advertência 1"}).catch(()=>{});

    const { guild, createNewGuildEntry} = require("database.js");
    guild.findById(message.guild.id, "edit usuariosReportados")
        .then(guildTable => {
            if (!guildTable) {
                createNewGuildEntry(message.guild.id);
                setTimeout(() => client.commands.reporte(client, message, args), 500);
                return;
            }
            let index = -1;
            if (!guildTable.usuariosReportados) guildTable.usuariosReportados = [];
            let users = guildTable.usuariosReportados;
            index = users.findIndex(i => i._id === member.id);
            let advNumber = 1;
            let userEntry;
            if (index < 0) {
                userEntry = {
                    _id: member.id,
                    primeira: {
                        _id: message.author.id,
                        text: reason
                    },
                    segunda: {}
                };
                index = users.length;
                let roles = [];
                roles.push(toxico);
                roles.push(adv1);
                addRoles(member, roles);
            } else {
                userEntry = users[index];
                if (userEntry.segunda._id) {
                    advNumber = 3;
                } else if (userEntry.primeira._id) {
                    userEntry.segunda = {
                        _id: message.author.id,
                        text: reason
                    };
                    advNumber = 2;
                    roles.push(toxico);
                    roles.push(adv1);
                    roles.push(adv2);
                    addRoles(member, roles);
                }
            }
            let embed;
            let embedDM;
            const { RichEmbed } = require("discord.js");
            if (advNumber === 3) {
                let report = guildTable.usuariosReportados[index];
                embed = new RichEmbed()
                    .setTitle(`${client.getEmoji("negado")} Membro banido`)
                    .addField("**Usuário banido**", member, true)
                    .addField("**Quem baniu:**", message.author,true)
                    .addField("**Advertência 1**", `<@${report.primeira._id}> : ${report.primeira.text}`)
                    .addField("**Advertência 2**", `<@${report.segunda._id}> : ${report.segunda.text}`)
                    .addField("**Advertência 3**", `${message.author} : ${reason}`)
                    .setColor("f781c6")
                    .setThumbnail(member.user.displayAvatarURL)
                    .setFooter(message.guild.name, message.guild.iconURL);
                embedDM = new RichEmbed()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL)
                    .setTitle(`Você foi banido por receber três advertências no servidor ${message.guild.name} ${client.getEmoji("negado")}`)
                    .addField(`${client.getEmoji("suicidu")} Advertência dada por:`, message.author.tag)
                    .addField(`Motivo 1:`, `<@${report.primeira._id}> : ${report.primeira.text}`)
                    .addField(`Motivo 2:`, `<@${report.segunda._id}> : ${report.segunda.text}`)
                    .addField(`Motivo 3:`, `${message.author} : reason`)
                    .setColor("f781c6")
                    .setThumbnail(message.guild.iconURL)
                    .setFooter(`Comando executado por: ${message.author.username}`)
                    .setTimestamp();
                guildTable.usuariosReportados.splice(index, 1);
                member.ban().catch(()=>{});
            } else {
                let x = advNumber === 1 ? "uma advertência" : "duas advertências"
                embed = new RichEmbed()
                    .setAuthor(`Punido por: ${message.author.tag}`)
                    .setDescription(`${member.user.username} Recebeu ${x}. ${client.getEmoji("negado")}`)
                    .addField("Staff Tag", message.author.tag, true)
                    .addField("Staff ID", message.author.id, true)
                    .addField("Discord tag", member.user.tag, true)
                    .addField("Discord ID", member.user.id, true)
                    .addField("Motivo:", reason)
                    .setColor("f781c6")
                    .setThumbnail(message.author.displayAvatarURL)
                    .setTimestamp();
                embedDM = new RichEmbed()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL)
                    .setTitle(`Você recebeu ${x} no servidor ${message.guild.name} ${client.getEmoji("negado")}`)
                    .addField(`${client.getEmoji("suicidu")} Advertência dada por:`, message.author.tag)
                    .addField(`Motivo:`, reason)
                    .setColor("f781c6")
                    .setThumbnail(message.guild.iconURL)
                    .setFooter(`Comando executado por: ${message.author.username}`)
                    .setTimestamp();
                guildTable.usuariosReportados[index] = userEntry;
            }
            guildTable.save()
                .then(() => {
                    let channel = message.channel;
                    if (guildTable.edit && guildTable.edit.reporte) {
                        channel = message.guild.channels.get(guildTable.edit.reporte);
                        if (!channel) channel = message.channel;
                    }
                    channel.send(embed).catch(()=>{});
                    member.send(embedDM).catch(()=>{});
                })
                .catch(err => {
                    console.log(err);
                    message.reply("Erro").catch(()=>{});
                });
        })
        .catch(console.error);
};

var addRoles = (member, roles) => {
    for (let i = 0; i < roles.length; ++i) {
        if (roles[i]) {
            roles[i] = roles[i].id;
        } else {
            roles.splice(i, 1);
        }
    }
    if (roles.length) member.addRoles(roles).catch(()=>{});
}

var checagem = (message, member) => {
    if (member.user.bot) {
        message.reply("**Você não pode reportar um bot!**").catch(()=>{});
        return 1;
    }
    if (member.id === message.guild.ownerID) {
        message.reply("Você não tem permissão para punir este usuário").catch(()=>{});
        return 1;
    }
    let executorRole = message.member.highestRole;
    let targetRole = member.highestRole;
    if (executorRole.comparePositionTo(targetRole) <= 0 && message.author.id !== message.guild.ownerID) {
        message.reply("Você não pode punir este usuário, seu cargo é menor ou igual a o do usuário a ser punido!").catch(()=>{});
        return 1;
    }
    let clientRole = message.guild.me.highestRole;
    if (clientRole.comparePositionTo(targetRole) <= 0) {
        message.reply("Não tenho permissão para punir este usúario").catch(()=>{});
        return 1;
    }
    return 0;
};
