module.exports = (client, message, args, prefix, guildTable) => {
    let welcome = guildTable.welcome;
    const { RichEmbed } = require("discord.js");
    let embed = new RichEmbed()
    .setAuthor(message.author.username, message.author.displayAvatarURL)
    .setDescription(`Olá ${message.author.username}, Bem Vindo ao painel de configurações da Lunna.`)
    .setThumbnail("https://cdn.discordapp.com/emojis/533388024889868288.png?v=1")
    .setColor("f781c6")
    .setFooter(message.guild.name, message.guild.iconURL)
    .setTimestamp();
    let canalWelcome = `${client.getEmoji("noswift")} Desativado | **Exemplo:**\n` + `\`\`\`\n${prefix}welcome canal welcome #bem-vindo\`\`\``;
    if (message.guild.channels.get(welcome.welcome._id)) {
       canalWelcome = `${client.getEmoji("yes")} Ativo | Canal: <#${welcome.welcome._id}>, ${prefix}welcome off welcome`;
    }
    embed.addField("Welcome | Canal de boas-vindas do Servidor:", canalWelcome);
    let welcomeTexto = `${client.getEmoji("switchOFF")} Desativado | **Exemplo:**\n` +
    `\`\`\`\n${prefix}welcome bem-vindo \${USER} Bem vindo ao servidor \${SERVER}\`\`\``;
    if (welcome.welcome.text.length) {
        welcomeTexto = `${client.getEmoji("yes")} Ativo | ${prefix}welcome bem-vindo <texto>\nMensagem: ${welcome.welcome.text}`;
    }
    embed.addField("Mensagem do Boas-Vindas:", welcomeTexto);
    let canalSaida = `${client.getEmoji("noswift")} Desativado | **Exemplo:**\n` + `\`\`\`\n${prefix}welcome canal saida #canal-saida\`\`\``;
    if (message.guild.channels.get(welcome.saida._id)) {
        canalSaida = `${client.getEmoji("yes")} Ativo | Canal: <#${welcome.saida._id}>, ${prefix}welcome off saida`;
    }
    embed.addField("Saída | Canal de despedida do Servidor:", canalSaida);
    let saidaTexto = `${client.getEmoji("noswift")} Desativado | **Exemplo:**\n` + `\`\`\`\n${prefix}welcome saida \${USER} saiu do servidor\`\`\``
    if (welcome.saida.text.length) {
        saidaTexto = `${client.getEmoji("yes")} Ativo | ${prefix}welcome saida <texto>\nMensagem: ${welcome.saida.text}`;
    }
    embed.addField("Mensagem de Despedida:", saidaTexto);
    let privadoTexto = `${client.getEmoji("noswift")} Desativado | **Exemplo:**\n` + `\`\`\`\n${prefix}welcome canal saida #canal-saida\`\`\``;
    if (welcome.privado.length) {
        privadoTexto = `${client.getEmoji("yes")} Ativo | ${prefix}welcome off privado\nMensagem: ${welcome.privado}`;
    }
    embed.addField("Privado | Mensagem de boas-vindas no Privado:", privadoTexto);
    message.channel.send(embed).catch(()=>{});
};
