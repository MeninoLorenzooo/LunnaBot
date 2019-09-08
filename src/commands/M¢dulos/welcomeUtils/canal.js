module.exports = (client, message, args, guildTable) => {
    if (args.length < 3) {
        return;
    }
    if (args[1] !== "welcome" && args[1] !== "saida") {
        return;
    }
    let mentionTest = /<#[0-9]{18}>/.test(args[2]) && args[2].length === 21;
    let idTest = /[0-9]{18}/.test(args[2]) && args[2].length === 18;
    if (!mentionTest && !idTest) {
        return message.reply("Canal inválido!").catch(()=>{});
    }
    let canalID = args[2].slice(args[2].length - 19, args[2].length - 1);
    let canal = message.guild.channels.get(canalID);
    if (!canal) {
        return message.reply("Canal inválido!").catch(()=>{});
    }
    guildTable.welcome[args[1]]["_id"] = canal.id;
    guildTable.save()
        .then(() => {
            const { RichEmbed } = require("discord.js");
            let embed = new RichEmbed()
            .addField("Welcome",
            `Você definiu o canal ${canal}, para mensagens de ${args[1] === "welcome" ? "boas vindas" : "despedida"} do servidor!`)
            .setColor("f781c6")
            .setFooter(message.guild.name, message.guild.iconURL)
            .setTimestamp();
            message.channel.send(embed).catch(()=>{});
        })
        .catch(error => {
            console.log(error);
            message.reply(`Erro`).catch(()=>{});
        });
};
