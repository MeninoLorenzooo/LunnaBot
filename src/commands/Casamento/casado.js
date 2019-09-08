module.exports = (client, message) => {
    const { userProperties } = require("database.js");
    let mentioned = message.mentions.users.first() || message.author;
    userProperties.findById(mentioned.id, {}, { lean: true })
        .then(user => {
            user = Object.assign(new userProperties(), user);
            let { marriedTo, marriageTimestamp } = user.marriage;
            if (marriedTo.length) {
                const moment = require("moment");
                moment.locale("pt-BR");
                const { RichEmbed } = require("discord.js");
                let embed = new RichEmbed()
                .setAuthor(mentioned.tag ? mentioned.tag : mentioned.user.tag, mentioned.displayAvatarURL)
                .setTitle(`💌 | Status do casamento`)
                .addField(`💘 | Casado com:`, `<@${marriedTo}>`, true)
                .addField(`⏰ | Casados há:`, moment.duration(new Date(message.createdTimestamp - marriageTimestamp)).humanize(), true)
                .setColor("f781c6")
                .setTimestamp();
                message.channel.send(embed).catch(()=>{});
            } else {
                message.reply(`<@${mentioned.id}> não está casado 💔`).catch(()=>{});
            }
        })
        .catch(console.error);
};