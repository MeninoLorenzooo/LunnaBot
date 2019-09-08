module.exports = (client, message, args, prefix) => {
    const { guild } = require("database.js");
    guild.findById(message.guild.id, "config").lean()
        .then(guildTable => {
            if (!guildTable) {
                guildTable = new guild({ _id: message.guild.id });
                newGuild.save().catch(console.error);
            }
            let config = guildTable.config;

            let msgMasculino = config.masculino
                ? `${client.getEmoji("yes")} Ativo | Cargo masculino: <@&${config.masculino}>`
                : `${client.getEmoji("noswift")} Desativado | Use: ${prefix}adicionar masculino`;
        
            let msgFeminino = config.feminino
                ? `${client.getEmoji("yes")} Ativo | Cargo feminino: <@&${config.feminino}>`
                : `${client.getEmoji("noswift")} Desativado | Use: ${prefix}adicionar feminino`;

            let msgNBinario = config.n_binario
                ? `${client.getEmoji("yes")} Ativo | Cargo não binário: <@&${config.n_binario}>`
                : `${client.getEmoji("noswift")} Desativado | Use: ${prefix}adicionar n_binario`;
            
            const { RichEmbed } = require("discord.js");
            let embed = new RichEmbed()
            .setAuthor(message.author.username, message.author.displatAvatarURL)
            .setDescription(
                `Olá **${message.author.username}**, este e o painel de configurações do registro em seu servidor.` +
                `Aqui você pode conferir as configurações do registro e comandos.`
            )
            .addField("Masculino", msgMasculino)
            .addField("Feminino", msgFeminino)
            .addField("Não Binário", msgNBinario)
            .setThumbnail("https://cdn.discordapp.com/emojis/533388024889868288.png")
            .setColor("f781c6")
            .setFooter(message.guild.name, message.guild.iconURL)
            .setTimestamp();

            message.channel.send(embed).catch(()=>{});
        })
        .catch(console.error);
};
