module.exports = (client, message, args, prefix, retry = 0) => {
    if (retry > 1) return 0;
    if (!message.member.hasPermission("MANAGE_ROLES", false, true, true)) {
        return message.reply("O comando está disponível apenas para usuários STAFF. <:fazeroq:519479790781071361>").catch(()=>{});
    }
    const { guild } = require("database.js");
    guild.findById(message.guild.id, "registradores config")
        .then(guildTable => {
            if (!guildTable) {
                guildTable = new guild({ _id: message.guild.id });
            }
            let member = message.mentions.members.first();
            if (!member) {
                return message.reply("Mencione o usuário que deseja registrar! <:gatinhoos2:518029263564439573>").catch(()=>{});
            }
            let hit = guildTable.registradores.some(registrador => {
                return registrador.membrosRegistrados.some(membro => membro._id === member.id);
            });
            if (hit) {
                return message.reply("Usuário já registrado <:s2:518062797423247380>").catch(()=>{});
            }
            let masculino = message.guild.roles.get(guildTable.config.masculino);
            let feminino = message.guild.roles.get(guildTable.config.feminino);
            let n_binario = message.guild.roles.get(guildTable.config.n_binario);
            if (!masculino || !feminino) {
                return message.reply(`O comando não foi configurado, para ter mais informações digite ${prefix}registro <:ham:519479738218315816>`).catch(()=>{});
            }
            let masculinoCheck = member.roles.has(guildTable.config.masculino);
            let femininoCheck = member.roles.has(guildTable.config.feminino);
            let nBinarioCheck = member.roles.has(guildTable.config.n_binario);
            if ((masculinoCheck && femininoCheck) || (masculinoCheck && nBinarioCheck) || (femininoCheck && nBinarioCheck)) {
                return message.reply("O usuário possui mais de um cargo do registro (masculino, feminino e não binário), deixe um e tente novamente <:ham:519479738218315816>").catch(()=>{});
            } else if (!masculinoCheck && !femininoCheck && !nBinarioCheck) {
                return message.reply(`**Registro incompleto!** Verifique se o mesmo possui a tag \`masculino\` ou \`feminino\` ou \`não binário\` em seu registro. <:ham:519479738218315816>`).catch(()=>{});
            }
            let gender;
            if (masculinoCheck) gender = "M";
            if (femininoCheck) gender = "F";
            if (nBinarioCheck) gender = "N";
            if (guildTable.registradores.length < 1) {
                guildTable.registradores[0] = {
                    _id: message.author.id,
                    membrosRegistrados: [{
                        _id: member.id,
                        genero: gender,
                        timestamp: message.createdTimestamp
                    }]
                };
            } else {
                let index = guildTable.registradores.findIndex(r => r._id === message.author.id);
                if (index >= 0) {
                    let membersNum = guildTable.registradores[index].membrosRegistrados.length;
                    guildTable.registradores[index].membrosRegistrados[membersNum] = {
                        _id: member.id,
                        genero: gender,
                        timestamp: message.createdTimestamp
                    };
                } else {
                    guildTable.registradores[guildTable.registradores.length] = {
                        _id: message.author.id,
                        membrosRegistrados: [{
                            _id: member.id,
                            genero: gender,
                            timestamp: message.createdTimestamp
                        }]
                    };
                }
            }
            guildTable.save()
                .then(() => {
                    let novatoRole = message.guild.roles.get(guildTable.config.novato);
                    if (novatoRole) {
                        member.removeRole(novatoRole.id, "registro").catch(()=>{});
                    }
                    const { RichEmbed } = require("discord.js");
                    let embedSv = new RichEmbed()
                    .setAuthor(`Registrador: ${message.author.username}`, message.author.displayAvatarURL)
                    .setDescription(`${message.author} você registrou o usuário ${member} com sucesso. <:s2:518062797423247380>`)
                    .setColor("f781c6");
                    message.channel.send(embedSv).catch(()=>{});
                    let embedDM1 = new RichEmbed()
                    .setTitle(`**Você foi registrado(a) no Servidor: ${member.guild.name}**`)
                    .setDescription(`**Você foi registrado(a) por ${message.author}, no Servidor: __${member.guild.name}__.**\n` +
                        `Caso não tenha se registrado por essa pessoa, entre em contato com <@469458019655352320>.`)
                    .setThumbnail(message.author.displayAvatarURL)
                    .setColor("f781c6");
                    let embedDM2 = new RichEmbed()
                    .setDescription(`**Olá! Gostou da Lunna? quer saber de novidades diárias , sempre está atualizado sobre novos comandos! entre no [suporte](https://discord.gg/4sKydcZ)**`)
                    .setThumbnail(client.getEmoji("apaixonado") ? client.getEmoji("apaixonado").url : "")
                    .setColor("f781c6");
                    member.send(embedDM1).catch(()=>{});
                    member.send(embedDM2).catch(()=>{});
                })
                .catch(console.error);
        })
        .catch(console.error);
};
