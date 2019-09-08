module.exports = async (client, message, args) => {
    if(!message.member.hasPermission("MANAGE_MESSAGES", false, true, true)) {
        return message.reply("**Você não tem permissão para limpar o chat! <:noswift:529635602292015134>**").catch(()=>{});
    }
    if (!message.guild.me.hasPermission("MANAGE_MESSAGES", false, true, true)) {
        return message.reply("Eu não tenho permissão para apagar mensagens nesse servidor. <:noswift:529635602292015134>").catch(()=>{});
    }
    if(!args[0]) {
        return message.reply("Fale uma quantidade de mensagens <:noswift:529635602292015134>").catch(()=>{});
    }
    let quantity = Number(args[0]);
    if (isNaN(quantity)) {
        return message.reply("A quantidade precisa ser um número <:noswift:529635602292015134>").catch(()=>{});
    }
    if (quantity < 1) {
        return message.reply("O número precisa ser maior que 0 <:noswift:529635602292015134>").catch(()=>{});
    } else if (quantity > 1000) quantity = 1000;

    var total = 0;

    do {
        var toBeDeleted = quantity;
        if (toBeDeleted > 100) toBeDeleted = 100;
        let deletedMessages = await message.channel.bulkDelete(toBeDeleted, true).catch(()=>{});
        if (!deletedMessages || deletedMessages.size < 1) {
            quantity = 0;
        } else {
            total += deletedMessages.size;
            quantity -= deletedMessages.size;
        }
    } while (quantity > 1);

    message.channel.send(`<:legalzinho:535419312131801108> **Removido ${total} mensagens**`)
        .then(msg => msg.delete(7000))
        .catch(()=>{});
};
