module.exports = (client, message) => {
    let usuario = message.mentions.users.first() || message.author;
    const { guild } = require("database.js");
    guild.findById(message.guild.id, "registradores").lean()
        .then(guildTable => {
            if (!guildTable) {
                let newGuild = new guild({ _id: message.guild.id });
                newGuild.save().catch(console.error);
                return message.reply("Usuário não registrado, fale com um registrador.").catch(()=>{});
            }
            if (guildTable.registradores.length) {
                var registradorID = "";
                var timestamp = 0;
                var registradores = guildTable.registradores;
                for (let u = 0; u < registradores.length; ++u) {
                    let memberArr = registradores[u].membrosRegistrados;
                    for (let i = 0; i < memberArr.length; ++i) {
                        if (memberArr[i]._id === usuario.id) {
                            registradorID = registradores[u]._id;
                            timestamp = memberArr[i].timestamp;
                            u = registradores.length;
                            break;
                        }
                    }
                }
                if (registradorID.length) {
                    const moment = require("moment");
                    moment.locale("pt-BR");
                    const { RichEmbed } = require("discord.js");
                    let embed = new RichEmbed()
                    .setAuthor(usuario.username, usuario.displayAvatarURL)
                    .setTitle("**Informações:**")
                    .addField("**Usuário:**", `${usuario}`, true)
                    .addField("**Registrado por:**", `<@${registradorID}>`, true)
                    .addField("Data do registro:", `\`\`\`\n${moment(timestamp).format("LL")}\`\`\``, false)
                    .addField("**__Conta criada:__**", moment(usuario.createdTimestamp).format("LL"), true)
                    .addField("Dias no Discord:", `${moment().diff(usuario.createdTimestamp, "days")} dias`, true)
                    .addField("Entrou no Server:", moment(message.guild.member(usuario).joinedTimestamp).format("LL"), true)
                    .addField("Dias no Servidor:", `${moment().diff(message.guild.member(usuario).joinedTimestamp, "days")} dias`, true)
                    .setColor("f781c6")
                    .setThumbnail(usuario.displayAvatarURL)
                    .setFooter(message.guild.name, message.guild.iconURL)
                    .setTimestamp();
                    return message.channel.send(embed).catch(()=>{});
                }
            }
            message.reply("Usuário não registrado, fale com um registrador.").catch(()=>{});
        })
        .catch(console.error);
};
