module.exports = (client, message, args, prefix) => {
    if (args.length < 2) {
        return message.reply(`Modo de uso: \`${prefix}doar <menção ou id> <quantidade>\``).catch(()=>{});
    }
    let id = /[0-9]{18}/.exec(args[0]);
    if (!id) {
        return message.reply("menção ou id invalido").catch(()=>{});
    }
    id = id[0];
    if (id === message.author.id) return;
    if (client.users.get(id) && client.users.get(id).bot) return;
    let quantidade = Number(args[1]);
    if (isNaN(quantidade)) {
        return message.reply("A quantidade precisa ser um número").catch(()=>{});
    }
    if (quantidade < 1) {
        return message.reply(`A quantidade precisa ser no minimo 1`).catch(()=>{});
    }
    const { userProperties } = require("database");
    Promise.all([
        userProperties.findById(message.author.id),
        userProperties.findById(id)
    ])
    .then(([doador, receptor]) => {
        let hasMoney = doador ? doador.money >= quantidade : false;
        if (!hasMoney) {
            return message.reply(`Você não tem R$${quantidade} coins`).catch(()=>{});
        }
        if (!doador.donations) doador.donations = 0;
        if (!doador.lastDonationDay) doador.lastDonationDay = 0;
        if (daysSinceLastDonation(doador.lastDonationDay) < 1) {
            if (doador.donations >= 2)
                return message.reply(`Você atingiu o limite de doações de hoje`).catch(()=>{});
        } else if (doador.donations >= 2) {
            doador.donations = 0;
        }
        if (quantidade > 150) {
            return message.reply(`Você só pode doar R$150 por doação`);
        }

        doador.money -= quantidade;
        doador.donations += 1;
        doador.lastDonationDay = getDayTimestamp(message.createdTimestamp);

        if (!receptor) {
            receptor = new userProperties({
                _id: id,
                amountXP: 0,
                lastXP: 0,
                money: 0,
                lastMining: 0,
                lastDonationDay: 0,
                donations: 0,
                items: []
            });
        }
        receptor.money += quantidade;
        Promise.all([
            doador.save(),
            receptor.save()
        ])
        .then(([doadorEntry, receptorEntry]) => {
            let user = client.users.get(id);
            if (!user) user = `<@${id}>`;
            else user = user.tag;
            message.reply(`R$${quantidade} coins doados para ${user} <:moeda:533388114186731522>`).catch(()=>{});
            client.emit("updateTopMoney", doadorEntry);
            client.emit("updateTopMoney", receptorEntry);
        })
        .catch(err => {
            message.reply("Erro").catch(()=>{});
            console.log(err);
        });
    })
    .catch(err => {
        message.reply("Erro").catch(()=>{});
        console.log(err);
    });
};

var daysSinceLastDonation = (timestamp = 0) => {
    const moment = require("moment");
    return Math.floor(moment().diff(timestamp, "days", true) - 0);
}

var getDayTimestamp = (timestamp = 0) => {
    const moment = require("moment");
    return moment(timestamp).startOf("day") - 0;
};
