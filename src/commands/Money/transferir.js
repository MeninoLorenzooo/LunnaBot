module.exports = (client, message, args, prefix) => {
    if (args.length < 3) {
        return message.reply(`Modo de uso: \`${prefix}transferir <menção ou id> <quantidade> <id do item> \``).catch(()=>{});
    }
    let id = /[0-9]{18}/.exec(args[0]);
    if (!id) {
        return message.reply("menção ou id invalido").catch(()=>{});
    }
    id = id[0];
    let quantidade = Number(args[1]);
    if (isNaN(quantidade)) {
        return message.reply("A quantidade precisa ser um número").catch(()=>{});
    }
    if (quantidade < 1) {
        return message.reply(`A quantidade precisa ser no minimo 1`).catch(()=>{});
    }
    let itemID = args[2];
    const { userProperties } = require("database");
    Promise.all([
        userProperties.findById(message.author.id),
        userProperties.findById(id)
    ])
    .then(([doador, receptor]) => {
        if (!doador || !doador.items) return message.reply(`Você não tem nenhum item com id \`${itemID}\``).catch(()=>{});
        let itemIndex = doador.items.findIndex(i => i._id === itemID);
        if (itemIndex < 0 || doador.items[itemIndex].quantity === 0) {
            return message.reply(`Você não tem nenhum item com id \`${itemID}\``).catch(()=>{});
        }
        let item = doador.items[itemIndex];
        if (item.quantity < quantidade) {
           return message.reply(`Você não tem ${quantidade} ${item.name} (\`${item._id}\`)`);
        }
        if ((item.quantity - quantidade) === 0) {
            doador.items.splice(itemIndex, 1);
        }
        if (!receptor) {
            receptor = new userProperties({ _id: id, amountXP: 0, lastXP: 0, money: 0, lastMining: 0, items: [] });
        }
        let receptorItemIndex = receptor.items.findIndex(i => i._id === item._id);
        if (receptorItemIndex >= 0) {
            receptor.items[receptorItemIndex].quantity += quantidade;
        } else {
            item.quantity = quantidade;
            receptor.items.push(item);
        }
        Promise.all([
            doador.save(),
            receptor.save()
        ])
        .then(() => {
            let user = client.users.get(id);
            if (!user) user = `<@${id}>`;
            else user = user.tag;
            message.reply(`${quantidade} ${item.name} (\`${item._id}\`) doados para ${user} <:legalzinho:535419312131801108>`).catch(()=>{});
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
