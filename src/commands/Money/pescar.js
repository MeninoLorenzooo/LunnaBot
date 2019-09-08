const HOUR = 60 * 60 * 1000;

module.exports = ({}, message) => {
    const { shop, userProperties } = require("database.js");
    Promise.all([
        shop.findById("shop", "items"),
        userProperties.findById(message.author.id)
    ])
    .then(([loja, user]) => {
        if (!user) user = new userProperties({ _id: message.author.id });
        if (!user.lastFishing) user.lastFishing = 0;
        if (!fishingTimeCheck(user.lastFishing, message.createdTimestamp)) {
            var ms = require("ms");
            let time = ms(HOUR - (message.createdTimestamp - user.lastFishing), { long: true });
            time = time.replace(/hour/g, "hora").replace(/minute/g, "minuto").replace(/second/g, "segundo");
            return message.reply(`Se acalme meu jovem pescador, os peixes estão se alimentando.. volte depois de \`${time}\` ⏰`).catch(()=>{});
        }
        if (!loja.items) {
            return message.reply(`Loja vazia`).catch(()=>{});
        }
        let item = getRandomInverseWeightedItem(user.items.some(i => i._id === "pesca"), ...loja.items);
        user.lastFishing = message.createdTimestamp;
        if (!item) {
            user.save().catch(console.error);
            const { RichEmbed } = require("discord.js");
                let embed = new RichEmbed()
                .setTitle("Maré Alta 🎣")
                .setDescription(`Parece que a maré está alta demais, infelizmente os itens do fundo do mar sumiram! 🌊`)
                .setThumbnail("https://uploads.spiritfanfiction.com/fanfics/historias/201801/e-como-se-ela-fosse-uma-concha-11733152-180120181813.gif")
                .setColor("f781c6");
            return message.reply(embed).catch(()=>{});
        }
        let index = user.items.findIndex(i => i._id === item._id)
        if (index >= 0) user.items[index].quantity++;
        else user.items.push(item);
        user.save()
            .then(() => {
                const { RichEmbed } = require("discord.js");
                let embed = new RichEmbed()
                .setTitle("Algo mordeu a isca 🎣")
                .addField(`Enquanto calmamente você pescava, algo fisgou sua isca!..você pescou um(a) ${item.name}`, `ID: ${item._id}`)
                .setThumbnail("https://canary.discordapp.com/assets/5d1c4702f5cfaccd74882f2598c4ba0e.svg")
                .setImage("https://i.warosu.org/data/biz/img/0084/71/1521615460116.gif")
                .setColor("f781c6");
                message.reply(embed).catch(()=>{});
            })
            .catch(() => message.reply(`Erro`).catch(()=>{}));
        let itemIndex = loja.items.findIndex(i => i._id === item._id);
        if (itemIndex >= 0) {
            --loja.items[itemIndex].quantity;
        }
        loja.save().catch(console.error);
    })
    .catch(console.error);
};

const blocked = [
    "headset",
    "mouse",
    "teclado"
];

var fishingTimeCheck = (lastFishingTimestamp, nowTimestamp) => {
    return nowTimestamp - lastFishingTimestamp >= HOUR ? true : false;
};

var getRandomInverseWeightedItem = (bonus, ...array) => {
    const failureRange = 0.7 - (bonus * 0.1);
    if (Math.random() < failureRange) return undefined;
    let copy = [];
    let lastRange = 0;
    while (array.length) {
        let item = array.pop();
        if (item.quantity === 0) continue;
        if (blocked.some(id => id === item._id)) continue;
        let priceMultiplier = Math.log(item.price) / Math.log(20);
        let range = item.quantity * priceMultiplier;
        copy.push({
            _id: item._id,
            name: item.name,
            price: item.price,
            range: lastRange + range
        });
        lastRange += range;
    }
    let chosen = Math.random() * (copy[copy.length - 1].range + 1);
    for (let i = 0; i < copy.length; ++i) {
        let last = 0.;
        if (i) last = copy[i - 1].range;
        if (last < chosen && chosen <= copy[i].range) {
            let { _id, name, price } = copy[i];
            return { _id, name, price, quantity: 1 };
        }
    }
    return undefined;
};
