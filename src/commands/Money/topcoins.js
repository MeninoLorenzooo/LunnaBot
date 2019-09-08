module.exports = (client, message) => {
    let text = "";
    for (let i = 0; i < _topRankMoney.length; ++i) {
        text += `<:Ausente:484132926896996372> ${i + 1}. ${getTag(client, _topRankMoney[i].id)} <:coin:531587145802973208> --> R$${_topRankMoney[i].money}\n`;
    }
    if (text.length) {
        const { RichEmbed } = require("discord.js");
        let embed = new RichEmbed()
        .setTitle("| Top Coins")
        .setDescription(text)
        .setColor(0xf781c6)
        .setThumbnail("https://cdn.discordapp.com/emojis/535419311746056208.png?v=1")
        .setImage("https://cdn.discordapp.com/attachments/533607378617237514/537816406540943410/54f3c2cc5ccacf2b7aead26d.gif");
        message.channel.send(embed).catch(()=>{});
    } else {
        message.channel.send("Nenhum usuario com dinheiro!").catch(()=>{});
    }
};

var getTag = (client, id) => {
    let user = client.users.get(id);
    if (!user) return id;
    return user.tag;
};
