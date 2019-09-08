module.exports = (client, message, args, prefix) => {
    if (!message.member.hasPermission("ADMINISTRATOR", false, true, true)) {
        return message.reply("**Você não possui permissões para utilizar esse comando!**").catch(()=>{});
    }
    var { guild } = require("database.js");
    guild.findById(message.guild.id, "config")
        .then(guildTable => {
            if (!guildTable) {
                guildTable = new guild({ _id: message.guild.id });
            }
            if (args[0] === "feminino" || args[0] === "masculino" || args[0] === "n_binario") {
                var role = message.mentions.roles.first();
                if (!role) {
                    return message.reply("Cargo inválido").catch(()=>{});
                }
                guildTable.config[args[0]] = role.id;
                guildTable.save()
                    .then(() => {
                        const { RichEmbed } = require("discord.js");
                        let embed = new RichEmbed()
                        .setAuthor(message.author.username, message.author.displayAvatarURL)
                        .setDescription(`Você definiu o cargo ${role} como ${args[0]} com sucesso.`)
                        .setColor("f781c6")
                        .setFooter(message.guild.name, message.guild.iconURL)
                        .setTimestamp();
                        message.channel.send(embed).catch(()=>{});
                    })
                    .catch(console.error);
            } else {
                message.reply(`Modo de uso: \`${prefix}adicionar [masculino || feminino || n_binario] @cargo\``);
            }
        })
        .catch(console.error);
};
