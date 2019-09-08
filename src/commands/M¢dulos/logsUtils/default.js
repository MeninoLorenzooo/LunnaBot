module.exports = (client, message, args, prefix, guildTable) => {
    let logs = guildTable.eventlog;
    const { RichEmbed } = require("discord.js");
    let embed = new RichEmbed()
    .setAuthor(message.author.username, message.author.displayAvatarURL)
    .setDescription(`Olá **${message.author.username}**, Bem Vindo ao painel de configurações dos logs.`)
    .setThumbnail("https://cdn.discordapp.com/emojis/533388024889868288.png?v=1")
    .setColor("f781c6")
    .setFooter(message.guild.name, message.guild.iconURL)
    .setTimestamp();

    let canalTexto = `${client.getEmoji("noswift")} Desativado | **Exemplo:**` + `\`\`\`\n${prefix}logs canal #monitoramento\`\`\``;
    if (logs._id) {
        canalTexto = `${client.getEmoji("yes")} Ativo | Canal: <#${logs._id}>, ${prefix}logs canal off`;
    }
    embed.addField("Logs | Define o canal dos logs:", canalTexto);

    let deletTexto = `${client.getEmoji("noswift")} Desativado | **Exemplo:**` + `\`\`\`\n${prefix}logs delet on\`\`\``;
    if (logs.delet) {
        deletTexto = `${client.getEmoji("yes")} Ativo | ${prefix}logs delet off`;
    }
    embed.addField("Mensagem Deletada | Mostra o evento de mensagens deletadas:", deletTexto);

    let editTexto = `${client.getEmoji("noswift")} Desativado | **Exemplo:**` + `\`\`\`\n${prefix}logs edit on\`\`\``;
    if (logs.edit) {
        editTexto = `${client.getEmoji("yes")} Ativo | ${prefix}logs edit off`;
    
    }
    embed.addField("Mensagem Editada | Mostra o evento de mensagens editadas:", editTexto);

    let banTexto = `${client.getEmoji("noswift")} Desativado | **Exemplo:**` + `\`\`\`\n${prefix}logs ban on\`\`\``;
    if (logs.ban) {
        banTexto = `${client.getEmoji("yes")} Ativo | ${prefix}logs ban off`;
    
    }
    embed.addField("Ban | Mostra o evento de membros banidos:", banTexto);

    let unbanTexto = `${client.getEmoji("noswift")} Desativado | **Exemplo:**` + `\`\`\`\n${prefix}logs unban on\`\`\``;
    if (logs.unban) {
        unbanTexto = `${client.getEmoji("yes")} Ativo | ${prefix}logs unban off`;
    }
    embed.addField("Unban | Mostra o evento de membros desbanidos:", unbanTexto);

    message.channel.send(embed).catch(()=>{});
};
