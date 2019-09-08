module.exports = (client, message) => {
    const { userProperties } = require("database.js");
    userProperties.findById(message.author.id, "money").lean()
        .then(userEntry => {
            let money = 0;
            if (userEntry && userEntry.money) money = userEntry.money;
            const { RichEmbed } = require("discord.js");
            let embed = new RichEmbed()
            .setTitle("| Saldo")
            .setDescription(`Você tem **R$${money}** em sua conta <:legalzinho:535419312131801108>`)
            .setImage("https://cdn.discordapp.com/attachments/533607378617237514/537814552113315880/quem_eh_que_resiste_a_uma_brilhantinha_dessas.gif")
            .setColor("#f781c6");
            message.channel.send(embed).catch(()=>{});
        })
        .catch(err => {
            message.reply("Erro").catch(()=>{});
            console.error(err);
        });
};
