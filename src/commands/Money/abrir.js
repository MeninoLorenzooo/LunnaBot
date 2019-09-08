module.exports = (client, message) => {
    if (message.author.id !== "323263095688396800") return;
    const { userProperties } = require("database.js");
    userProperties.findById(message.author.id)
        .then(user => {
            if (!user || !user.items.length) {
                return message.reply(`Você não tem nenhuma caixa em seu inventário`).catch(()=>{});
            }
            let index = user.items.findIndex(i => i._id === "caixa");
            if (index < 0) {
                return message.reply(`Você não tem nenhuma caixa no seu inventário`);
            }
            if (user.items[index].quantity <= 1) {
                user.items.splice(index, 1);
            } else user.items[index].quantity -= 1;
            
            openBox(message, user);
        })
        .catch(err => {
            message.reply("Erro").catch(()=>{});
            console.error(err);
        });
};

const blocked = [
    "headset",
    "mouse",
    "teclado"
];

async function openBox (message, user) {
    const { shop } = require("database.js");
    const { items } = await shop.findById("shop");
    let copy = [];
    let lastRange = 0;
    for (let i = 0; i < items.length; ++i) {
        if (blocked.some(x => x === items[i]._id)) continue;
        if (items[i].price < 40) continue;
        lastRange += (1 / Math.log2(items[i].price));
        copy.push({
            _id: items[i]._id,
            name: items[i].name,
            price: items[i].price,
            quantity: 1,
            range: lastRange
        });
    }
    let randomNumber = Math.random() * lastRange;
    let item;
    for (let i = 0; i < copy.length; ++i) {
        if (randomNumber < copy[i].range) {
            item = copy[i];
            delete item.range;
            break;
        }
    }
    let itemIndex = user.items.findIndex(i => i._id === item._id);
    if (itemIndex >= 0) user.items[itemIndex].quantity += 1;
    else user.items.push(item);

    let money = gaussianRandom(100, 600);
    user.money += money;
    user.save()
        .then(() => {
            const { RichEmbed } = require("discord.js")
            let embed = new RichEmbed()
            .addField("Item ganho:", `${item.name} (${item._id})`)
            .addField("Dinheiro ganho:", `R$${money}`)
            .setTimestamp();
            message.reply(embed).catch(()=>{});
        })
        .catch(err => {
            message.reply(`Erro`).catch(()=>{});
            console.error(err);
        });
}
  
function gaussianRandom(start, end) {
    let rand = 0;
    for (let i = 0; i < 6; i += 1) {
        rand += Math.random();
    }
    rand /= 6;
    return Math.floor(start + rand * (end - start + 1));
}
