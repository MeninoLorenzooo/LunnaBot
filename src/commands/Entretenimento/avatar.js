module.exports = async (client, message, args) => {
    let abUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));

    const { RichEmbed } = require("discord.js");
    if (abUser) {
        let abicon = abUser.user.avatarURL;
        let avatarEmbed2 = new RichEmbed()
        .setDescription(`:tada: **|** **Aqui está seu avatar!\n [Clique aqui](${abicon}) para baixar**`)
        .setColor("#f781c6")
        .setImage(abicon);
        message.channel.send(avatarEmbed2).catch(()=>{});
    } else {
        let micon = message.author.avatarURL;
        let avatarEmbed = new RichEmbed()
        .setTitle(`:tada: **|** **Avatar pego com sucesso!**`)
        .setDescription(`[Clique aqui](${micon}) para baixar`)
        .setColor("#f781c6")
        .setImage(micon);
        message.channel.send(avatarEmbed).catch(()=>{});
    }
};
