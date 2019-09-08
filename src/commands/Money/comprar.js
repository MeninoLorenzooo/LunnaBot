module.exports = (client, message, args, prefix) => {
    if (args.length < 2) {
        return message.reply(`Modo de uso: \`${prefix}comprar <quantidade> <id do item>\``).catch(()=>{});
    }
    let [quantidade, ...id] = args;
    id = id.join(' ');
    quantidade = Number(quantidade);
    if (isNaN(quantidade)) {
        return message.reply(`A quantidade precisa ser um número`).catch(()=>{});
    }
    if (quantidade < 1) {
        return message.reply("Quantidade mínima: 1").catch(()=>{});
    }
    const { shop, userProperties } = require("database");
    Promise.all([
        shop.findById("shop", "items"),
        userProperties.findById(message.author.id, "items money")
    ])
    .then(([loja, user]) => {
        if (!loja || !loja.items || !loja.items.length) {
            return message.reply("Loja vazia").catch(()=>{});
        }
        let item = undefined;
        for (let i = 0; i < loja.items.length; ++i) {
            if (loja.items[i]._id === id) {
                item = loja.items[i];
                break;
            }
        }
        if (!item) {
            return message.reply(`Nenhum item com id  ${id}  na loja`).catch(()=>{});
        }
        if (item.quantity < quantidade) {
            let txt = `Existem apenas ${item.quantity} copias do item \`${id}\`, você tentou comprar ${quantidade}`;
            if (item.quantity === 0) txt = `Não há copias deste item na loja`;
            return message.reply(txt).catch(()=>{});
        }
        if (!user || !user.money || user.money < quantidade * item.price) {
            return message.reply(`Você não tem coins para comprar ${quantidade} \`${id}\``).catch(()=>{});
        }
        item.quantity -= quantidade;
        //if (item.quantity === 0) removeItem(loja, item._id);
        user.money -= quantidade * item.price;
        if (Array.isArray(user.items)) {
            let itemIndex = user.items.findIndex(i => i._id === item._id);
            if (itemIndex >= 0) {
                user.items[itemIndex].quantity += quantidade;
            } else {
                user.items.push({ _id: item._id, name: item.name, quantity: quantidade, price: item.price });
            }
        } else {
            user.items = [{ _id: item._id, name: item.name, quantity: quantidade, price: item.price }];
        }
        Promise.all([
            loja.save(),
            user.save()
        ])
        .then(([lojaEntry, userEntry]) => {
            message.reply(`Você comprou ${quantidade} \`${id}\` com sucesso! ele foi adicionado a sua mochila <:mochilinha:537970763643355186>`).catch(()=>{});
            client.emit("updateTopMoney", userEntry);
        })
        .catch(err => {
            message.reply("Erro").catch(()=>{});
            console.log(err);
        });
    })
    .catch(err => {
        console.log(err);
        message.reply("Erro").catch(()=>{});
    });
};

var removeItem = (loja, id) => {
    let items = loja.items;
    if (!items) {
        loja.items = [];
        items = loja.items;
        return 0;
    }
    for (let i = 0; i < items.length; ++i) {
        if (items[i]._id === id) {
            items.splice(i, 1);
            return 0;
        }
    }
    return 1;
};
