module.exports = (client, message) => {
    let text = "";
    for (let i = 0; i < _topRankXP.length; ++i) {
        text += `<:4731_IMessages:529635716175626270> ${i + 1}. ${getTag(client, _topRankXP[i].id)} <:yes:529635602283626516> Nivel --> ${_topRankXP[i].xp}\n`;
    }
    if (text.length) {
        const { RichEmbed } = require("discord.js");
        let embed = new RichEmbed()
        .setTitle("| Top XP")
        .setDescription(text)
        .setColor(0xf781c6)
        .setThumbnail("https://cdn.discordapp.com/emojis/535419311892856832.png?v=1");
        message.channel.send(embed).catch(()=>{});
    } else {
        message.channel.send("Nenhum usuario com xp!").catch(()=>{});
    }
};

var getTag = (client, id) => {
    let user = client.users.get(id);
    if (!user) return id;
    return user.tag;
};
