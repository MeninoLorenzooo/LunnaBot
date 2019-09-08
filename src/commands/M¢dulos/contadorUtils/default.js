module.exports = (client, message, args, prefix, guildTable) => {
    let contador = guildTable.contador;
    const { RichEmbed } = require("discord.js");
    let embed = new RichEmbed()
    .setAuthor(message.author.username, message.author.displayAvatarURL)
    .setDescription(`Olá **${message.author.username}**, Bem Vindo ao painel de configurações do contador de membros.`)
    .setColor("f781c6")
    .setThumbnail('https://cdn.discordapp.com/emojis/533388024889868288.png?v=1')
    .setFooter(message.guild.name, message.guild.iconURL || "")
    .setTimestamp();
    if (contador.status) {
        embed.addField("Canal | Define o canal do contador:", `${client.getEmoji("yes")} Ativo | Canal: <#${contador._id}>, ${prefix}contador off`, false);
    } else {
        embed.addField("Canal | Define o canal do contador:", `<:noswift:529635602292015134> Desativado | Exemplo:\n` +
        `\`\`\`\n${prefix}contador canal #chat-geral\`\`\``, false);
    }
    let txt = contador.text.length ? `${client.getEmoji("yes")} Ativo | Texto: **${contador.text}**` : `${client.getEmoji("noswift")} | Exemplo:`;
    embed.addField("Texto | Define o texto do contador:", `${txt}\n` + `\`\`\`\n${prefix}contador texto <texto>\`\`\``);
    let curr = contador.format;
    if (curr === "0") {
        curr = "01";
    } else if (curr === "NN") {
        curr = "2N";
    } else if (curr === "TT") {
        curr = "3TT";
    }
    embed.addField(`Número | ${client.getEmoji("01")}`, client.getEmoji("fundo"), true)
    .addField(`Número | ${client.getEmoji("2NN")}`, client.getEmoji("fundo"), true)
    .addField(`Número | ${client.getEmoji("3TT")}`, client.getEmoji("fundo"), true)
    .addField(`Tipo atual: ${client.getEmoji(curr)}`, `${prefix}contador cor <número>`);
    message.channel.send(embed).catch(()=>{});
};
