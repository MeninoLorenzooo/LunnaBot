module.exports = ({}, message, args, prefix) => {
    if (args.length < 2) {
        return message.reply(`Modo de uso: \`${prefix}vender <quantidade> <id do item>\``).catch(()=>{});
    }
    let [ quantidade, id ] = args;
    quantidade = Number(quantidade);
    if (isNaN(quantidade) || quantidade < 0) {
        return message.reply(`A quantidade precisa ser um número maior que 0`).catch(()=>{});
    }
    quantidade = ~~quantidade;
    const { shop, userProperties } = require("database.js");
    Promise.all([
        shop.findById("shop"),
        userProperties.findById(message.author.id)
    ])
    .then(([ loja, user ]) => {
        let item = user.items.find(i => i._id === id);
        if (!item) {
            return message.reply(`Você não tem nenhum item com id \`${id}\` no seu inventário`).catch(()=>{});
        }
        if (quantidade > item.quantity) {
            return message.reply(`Você não tem ${quantidade} \`${id}\` para vender`).catch(()=>{});
        }
        let sellingPrice = item.price ? ~~(item.price / 6) : 20;
        user.items = removeQuantityItems({ items: user.items, item }, quantidade);
        loja.items = addQuantityItems({ items: loja.items, item }, quantidade);
        user.money += sellingPrice * quantidade;
        Promise.all([
            loja.save(),
            user.save()
        ])
        .then(() => {
            message.reply(`Você vendeu ${quantidade} \`${id}\` por R$${quantidade * sellingPrice} com sucesso`).catch(()=>{});
        })
        .catch(err => {
            message.reply("Erro ao efetuar a venda").catch(()=>{});
            console.error(err);
        })
    })
    .catch(console.error)
};

function removeQuantityItems({ items, item }, quantidade) {
    let index = items.findIndex(i => i._id === item._id);
    item.quantity -= quantidade;
    if (item.quantity === 0) {
        items.splice(index, 1);
    }
    return items;
}

function addQuantityItems({ items, item }, quantidade) {
    let index = items.findIndex(i => i._id === item._id);
    if (index < 0) {
        if (!item.price) item.price = 20;
        item.quantity = quantidade;
        items.splice(items.length - 2, 0, item);
    } else {
        items[index].quantity += quantidade;
    }
    return items;
}
