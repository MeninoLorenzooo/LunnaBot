module.exports = (client, message, args, guildTable) => {
    if (args.length < 2) {
        return;
    }
    if (args[1] === "privado") {
        guildTable.welcome[args[1]] = "";
    } else if ((args[1] === "welcome" || args[1] === "saida")) {
        guildTable.welcome[args[1]]["_id"] = "";
    } else {
        return;
    }
    guildTable.save()
        .then(() => {
            let msg = args[1];
            if (args[1] === "welcome" && args[1] !== "saida") {
                msg = "boas vindas";
            }
            if (args[1] === "privado") {
                msg += "no privado"
            }
            const { RichEmbed } = require("discord.js");
            let embed = new RichEmbed()
            .setDescription(`**A mensagem de ${msg} foi desativada com sucesso!**`)
            .setColor("f781c6")
            .setFooter(message.guild.name, message.guild.iconURL)
            .setTimestamp();
            message.channel.send(embed).catch(()=>{});
        })
        .catch(err => {
            console.log(err);
            message.reply("Erro").catch(()=>{});
        });
};
