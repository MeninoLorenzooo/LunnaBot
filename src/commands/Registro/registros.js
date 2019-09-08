module.exports = (client, message) => {
    const { guild } = require("database.js");
    guild.findById(message.guild.id, "registradores").lean()
        .then(async guildTable => {
            if (!guildTable) {
                let newGuild = new guild({ _id: message.guild.id });
                newGuild.save().catch(console.error);
                return message.reply("Nenhum usuário foi registrado neste servidor  <:ham:519479738218315816>").catch(()=>{});
            }
            const { Collection } = require("discord.js");
            var members = new Collection();
            if (message.guild.memberCount >= 250) {
                let g = await message.guild.fetchMembers().catch(()=>{});
                members = g.members;
            } else {
                members = message.guild.members;
            }
            var registradores = guildTable.registradores;
            var top = [];
            registradores.forEach((registrador, index, registradores) => {
                let registradorMembro = members.get(registrador._id);
                if (!registradorMembro) {
                    return registradores = registradores.splice(index, 0);
                }
                let m = 0;
                let f = 0;
                let n = 0;
                registrador.membrosRegistrados.forEach(membro => {
                    if (membro.genero === "M") ++m;
                    if (membro.genero === "F") ++f;
                    if (membro.genero === "N") ++n;
                });
                let current = {
                    username: registradorMembro.user.username,
                    m,
                    f,
                    n,
                    t : m + f + n
                };
                if (top.length) {
                    for (let i = 0; i < top.length; ++i) {
                        if (current.t > top[i].t) {
                            top.splice(i, 0, current);
                            break;
                        }
                    }
                    if (top.length < 5) top.push(current);
                    if (top.length > 5) top.pop();
                } else {
                    top[0] = current;
                }
            });
            if (!top.length) {
                return message.reply("Nenhum usuário foi registrado neste servidor <:ham:519479738218315816>").catch(()=>{});
            }
            const { RichEmbed } = require("discord.js");
            let embed = new RichEmbed()
            .setTitle(`Rank dos registradores do: ${message.guild.name} <:s2:518062797423247380>`)
            .setColor("f781c6")
            .setThumbnail('https://cdn.discordapp.com/emojis/518029264113762307.png?v=1')
            .setFooter(`Comando requisitado por: ${message.author.username}`, message.author.displayAvatarURL);
            var positionToEmoji = position => {
                var arr = [
                    ":first_place:",
                    ":second_place:",
                    ":third_place:",
                    client.getEmoji("fourth_place"),
                    client.getEmoji("fifth_place")
                ];
                return arr[position - 1];
            };
            for (let i = 0, pos = 1, lastPos = 1; i < top.length; ++i) {
                if (i === 0) {
                    pos = 1;
                } else if (top[i].t === top[i - 1].t) {
                    pos = lastPos;
                } else {
                    pos = i + 1;
                }
                embed.addField( `**${positionToEmoji(pos)}__${top[i].username}__**`,

                    `${client.getEmoji("homi")} **Masculino:** ${top[i].m}\n` +
                    `${client.getEmoji("muie")} **Feminino:** ${top[i].f}\n` +
                    `:bust_in_silhouette: **Não Binário:** ${top[i].n}\n` +
                    `${client.getEmoji("sexy")} **Total: ${top[i].t}**`
                );
            }
            message.channel.send(embed).catch(()=>{});
        })
        .catch(console.error);
};
