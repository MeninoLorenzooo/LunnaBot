module.exports = async (client, message) => {
    if(!message.member.hasPermission("BAN_MEMBERS", false, true, true)) {
        return message.reply("Desculpe, você não tem permissão de desbanir usuários neste servidor! <:noswift:529635602292015134>").catch(()=>{});
    }
    if (!message.guild.me.hasPermission("BAN_MEMBERS", false, true)) {
        return message.reply("Eu não tenho permissão para desbanir usuários nesse servidor. <:noswift:529635602292015134>").catch(()=>{});
    }
    let bannedUsers = await message.guild.fetchBans().catch(()=>{});
    let size = bannedUsers.size;
    message.channel.send(`Começando | 0/${size}`)
        .then(async m => {
            let i = 0;
            for (var user of bannedUsers.values()) {
                await m.guild.unban(user)
                    .then(() => {
                        ++i;
                        if (i % 10 === 0) {
                            m.edit(`${i}/${size}`).catch(()=>{});
                        }
                    })
                    .catch(()=>{});
            }
            m.edit("Pronto").catch(()=>{});
        })
        .catch(()=>{});
};
