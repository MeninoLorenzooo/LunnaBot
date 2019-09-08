module.exports = async (client, message, args) => {
    if(!message.member.hasPermission("BAN_MEMBERS", false, true, true)) {
        return message.reply("Desculpe, você não tem permissão de banir usuários neste servidor! <:noswift:529635602292015134>").catch(()=>{});
    }
    if (!message.guild.me.hasPermission("BAN_MEMBERS", false, true)) {
        return message.reply("Eu não tenho permissão para banir usuários nesse servidor. <:noswift:529635602292015134>").catch(()=>{});
    }
    if (args.length < 1) {
        return message.reply("Mencione alguém ou use o ID <:noswift:529635602292015134>").catch(()=>{});
    }
    var bUser;
    if (message.mentions.members.size > 0 && /<@!?[\d]{18}>/.test(args[0])) {
        bUser = message.mentions.members.first();
    }
    else if (/[\d]{18}/.test(args[0]) && args[0].length === 18) {
        bUser = message.guild.members.get(args[0]) || args[0];
    }
    else {
        return message.reply("Mencione alguém do servidor ou use o ID").catch(()=>{});
    }

    // Executa se o membro a ser banido está no servidor
    if (typeof bUser !== "string") {
        if (bUser.id === message.guild.ownerID) {
            return message.reply("Você não tem permissão para banir este usuário <:noswift:529635602292015134>").catch(()=>{});
        }
        if (bUser.id === client.user.id) {
            return message.reply("Não posso me banir <:noswift:529635602292015134>").catch(()=>{});
        }
        let executorRole = message.member.highestRole;
        let targetRole = bUser.highestRole;
        if (executorRole.comparePositionTo(targetRole) <= 0 && message.author.id !== message.guild.ownerID) {
            return message.reply("Você não tem permissão para banir este usuário <:noswift:529635602292015134>").catch(()=>{});
        }
        let clientRole = message.guild.me.highestRole;
        if (clientRole.comparePositionTo(targetRole) <= 0) {
            return message.reply("Não tenho permissão para banir este usúario <:noswift:529635602292015134>").catch(()=>{});
        }
    }
    let bReason = args.slice(1).join(' ');
    let executor = `executor: ${message.author.tag}`;
    bReason = bReason ? `${bReason}, ${executor}` : `Motivo não informado, ${executor}`;
    message.guild.ban(bUser, {reason : bReason})
        .then(async banned => { 
            var user;
            let username = "\`User\`";
            let URL = "https://i.imgur.com/TgJXsIG.png";
            if (typeof banned !== "string") {
                user = banned;
                username = banned.tag || banned.user.tag;
                URL = banned.displayAvatarURL || banned.user.displayAvatarURL;
            } else {
                let auditLogs = await message.guild.fetchAuditLogs({type : "MEMBER_BAN_ADD", limit : 5}).catch(()=>{});
                let entries = auditLogs.entries.array();
                for (let i = 0; i < entries.length; ++i) {
                    if (entries[i].executor.id !== client.user.id) continue;
                    user = entries[i].target;
                    username = user.tag;
                    URL = user.displayAvatarURL;
                    i = entries.length;
                }
            }
            const { RichEmbed } = require("discord.js");
            let embed = new RichEmbed()
            .setTitle("Acão | Ban")
            .addField("Executor", `\`${message.author.tag}\``, true)
            .addField("ID", `\`${message.author.id}\``, true)
            .addField("Usuário banido", `\`${username}\``, true)
            .addField("ID", `\`${typeof banned === "string" ? banned : banned.id}\``, true)
            .addField("Motivo", args.slice(1).join(' ') || "Motivo não informado")
            .setThumbnail(URL)
            .setColor("f781c6")
            .setTimestamp();
            message.channel.send(embed).catch(()=>{});
            message.delete().catch(()=>{});
                            
            // Não há necessidade de enviar a mensagem de ban no DM de um bot
            if (user.bot) return;

            let dmEmbed = new RichEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL)
            .setTitle(`Você foi banido do servidor ${message.guild.name} <:banned:533045584542564353>`)
            .addField(`${client.emojis.find(e => e.name === "suicidu")}Quem baniu`, message.author.tag)
            .addField(" Motivo", args.slice(1).join(' ') || "Motivo não informado")
            .setThumbnail(message.guild.iconURL ? `${message.guild.iconURL}?size=2048` : "https://cdn.discordapp.com/emojis/533045584542564353.png?v=1")
            .setColor("f781c6")
            .setFooter(`Comando executado por: ${message.author.tag}`)
            .setTimestamp();
            user.send(dmEmbed)
                .catch(() => message.channel.send("Nao foi possivel avisar o usuario no DM <:noswift:529635602292015134>").catch(()=>{}));
        })
        .catch(err => {
            if (typeof err === "object" && err.message === "Unknown User") {
                message.reply("Usuário não encontrado <:noswift:529635602292015134>").catch(()=>{});
            }
        });
};
