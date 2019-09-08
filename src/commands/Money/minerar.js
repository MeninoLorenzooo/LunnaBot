const TWO_HOURS = 2 * 60 * 60 * 1000;
const minMoney = 50, maxMoney = 100;

module.exports = (client, message) => {
    const { userProperties } = require("database.js");
    userProperties.findById(message.author.id, "money lastMining")
        .then(userEntry => {
            let lastTimestamp = userEntry && userEntry.lastMining
                                ? userEntry.lastMining
                                : 0;
            let nowTimestamp = message.createdTimestamp;
            let moneyMined = mine(lastTimestamp, nowTimestamp);
            if (!moneyMined) {
                const ms = require("ms");
                let time = ms(TWO_HOURS - (nowTimestamp - lastTimestamp), { long: true });
                time = time.replace(/hour/g, "hora").replace(/minute/g, "minuto").replace(/second/g, "segundo");
                return message.reply(`Poxa parece que você minerou demais, descanse um pouco e retorne depois de \`${time}\` ⏰`).catch(()=>{});
            }
            if (!userEntry) {
                var userEntry = new userProperties({
                    _id: message.author.id,
                    amountXP: 0,
                    lastXP: 0,
                    money: moneyMined,
                    lastMining: message.createdTimestamp,
                    lastDonationDay: 0,
                    donations: 0,
                    items: []
                });
            } else {
                if (!userEntry.money) userEntry.money = moneyMined;
                else userEntry.money += moneyMined;
                userEntry.lastMining = nowTimestamp;
            }
            userEntry.save().then(entry => {
                message.reply(`:pick: mineirando, mineirando, você mineirou ${moneyMined} coins <:moeda:533388114186731522>`).catch(()=>{});
                client.emit("updateTopMoney", entry);
            }).catch(()=>{});
        })
        .catch(err => {
            message.reply("Erro").catch(()=>{});
            console.error(err);
        });
};

var mine = (lastMinedTimestamp, nowTimestamp) => {
    return nowTimestamp - lastMinedTimestamp >= TWO_HOURS ? getRandomInt() : null;
};

var getRandomInt = (min = minMoney, max = maxMoney) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
