module.exports = (client, message) => {
    const { userProperties } = require("database");
    userProperties.findById(message.author.id, "items").lean()
        .then(userEntry => {
            let items = [];
            if (userEntry) items = userEntry.items || [];
            let embeds = createEmbeds(items, message.author.displayAvatarURL);
            if (Array.isArray(embeds)) sendAndCreateCollector(message, embeds)
            else message.channel.send(embeds).catch(()=>{});
        })
        .catch(err => {
            message.reply("Erro").catch(()=>{});
            console.error(err);
        });
};

const TIME = 2 * 60 * 1000;

var sendAndCreateCollector = async ({channel, author}, embeds) => {
    let currIndex = 0;
    let msg = await channel.send(embeds[currIndex]).catch(()=>{});
    const emojis = ["⬅", "➡"];
    for (let i = 0; i < emojis.length; ++i) {
        await msg.react(emojis[i]);
    }
    const filter = (reaction, user) => emojis.some(e => e === reaction.emoji.name) && user.id === author.id;
    msg.createReactionCollector(filter, { time: TIME })
        .on("collect", async reaction => {
            let modifier = emojis.findIndex(e => e === reaction.emoji.name);
            if (modifier < 0) return;
            let newIndex = modifier === 1 ? currIndex + 1 : currIndex - 1;
            if (0 <= newIndex && newIndex < embeds.length) {
                msg.edit(embeds[newIndex]).then(() => currIndex = newIndex).catch(()=>{});
            }
            reaction.remove(author).catch(()=>{});
        });
        //.on("end", () => msg.delete().catch(()=>{}));
};

const ITEMS_PER_PAGE = 8;

var createEmbeds = (items, url) => {
    let embeds = [];
    const { RichEmbed } = require("discord.js");
    if (items.length === 0) {
        embeds = new RichEmbed()
        .setDescription("<:mochilinha:537970763643355186> Inventário vazio")
        .setThumbnail(url)
        .setColor("#f781c6");
        return embeds;
    }
    while (items.length) {
        let embed = new RichEmbed();
        let iter = items.length / ITEMS_PER_PAGE >= 1
                   ? ITEMS_PER_PAGE
                   : items.length % ITEMS_PER_PAGE;
        for (let i = 0; i < iter; ++i) {
            embed.setTitle("<:mochilinha:537970763643355186> | Inventário")
            embed.addField(items[i].name,`ID: ${items[i]._id}\nPreço de venda: ${~~(items[i].price / 6)}\n${items[i].quantity} no inventário`, true);
        }
        embed.setThumbnail(url);
        embed.setColor("#f781c6")
        items.splice(0, iter);
        embeds.push(embed);
    }
    if (embeds.length === 1) embeds = embeds[0];
    return embeds;
};
