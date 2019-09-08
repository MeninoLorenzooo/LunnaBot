module.exports = (client, message) => {
    const { shop } = require("database");
    shop.findById("shop")
        .then(loja => {
            let items = [];
            if (loja) items = loja.items || [];
            let embeds = createEmbeds(items);
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
    if (!msg) return;
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

var createEmbeds = items => {
    let embeds = [];
    const { RichEmbed } = require("discord.js");
    if (items.length === 0) {
        embeds = new RichEmbed()
        .setDescription("Loja vazia")
        .setColor("#f781c6");
        return embeds;
    }
    while (items.length) {
        let embed = new RichEmbed();
        let iter = items.length / ITEMS_PER_PAGE >= 1
                   ? ITEMS_PER_PAGE
                   : items.length % ITEMS_PER_PAGE;
        for (let i = 0; i < iter; ++i) {
            embed.addField(items[i].name,
                           `ID: ${items[i]._id}\n` +
                           `R$${items[i].price}\n` +
                           `${items[i].quantity} no estoque`, true);
        }
        embed.setTitle("Lojinha da lunna")
        embed.setDescription('Olá meus queridos amiguinhos(a) desejo sorte a todos ao minerar e conseguir itens da loja!\no item **Teclado Gamer** e real! ao alcançar entre em contato com o criador \n<@469458019655352320>\n')
        embed.setColor("#f781c6")
        embed.setThumbnail("http://icons.iconarchive.com/icons/custom-icon-design/flatastic-11/512/Shop-icon.png")
        items.splice(0, iter);
        embeds.push(embed);
    }
    if (embeds.length === 1) embeds = embeds[0];
    return embeds;
};
