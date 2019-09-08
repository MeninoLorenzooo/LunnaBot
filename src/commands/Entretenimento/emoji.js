module.exports = async (client, message, args, prefix) => {
    if (args.length < 1) {
        return message.channel.send(setEmbed(client, message)).catch(()=>{});
    }
    let length = args[0].length;
    let emojiID = args[0].slice(length - 19, length - 1);
    let emoji = message.guild.emojis.get(emojiID);
    if (!emoji) {
        return message.channel.send(setEmbed(client, message, prefix)).catch(()=>{});
    }
    const { RichEmbed } = require("discord.js");
    let embed = new RichEmbed()
    .setTitle(`ID = \`${emoji.id}\``)
    .setImage(emoji.url)
    .setTimestamp();
    message.channel.send(embed).catch(()=>{});
};

/**
 * Função para fazer a embed caso um emoji não seja especificado
 * @param {EventEmitter} client O bot que está rodando o programa
 * @param {Object} message O objeto mensagem enviado
*/
var setEmbed = (client, message, prefix) => {
    let url = message.author.avatarURL || message.author.defaultAvatarURL;
    const { RichEmbed } = require("discord.js");
    let embed = new RichEmbed()
    .setAuthor(message.author.tag, url)
    .setTitle(`Modo de uso: ${client.getEmoji("olhando")}`)
    .addField(`Exemplo de como usar o comando`, `${prefix}emoji ${client.getEmoji("gatinhoo")}`)
    .setFooter(`Comando executado por: ${message.author.username}`)
    .setThumbnail("https://cdn.discordapp.com/emojis/518029264113762307.png?v=1")
    .setColor("f781c6")
    .setTimestamp();
    return embed;
};
