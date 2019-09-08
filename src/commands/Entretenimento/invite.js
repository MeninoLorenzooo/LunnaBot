module.exports = (client, message) => {
    const { RichEmbed } = require("discord.js");

    let embed = new RichEmbed()
    .setColor('#f781c6')
    .setDescription('**<:teamo:533045655749394462> Olá eu sou a Lunna, meu invite esta logo abaixo na reação!**')
    .addField('| Invite --> 💌','**Aqui é onde fica o link da Lunna para adicionar no seu servidor e o link do suporte!**')
    .setThumbnail(client.user.avatarURL)
    .setFooter(`Pedido por ${message.author.tag}`, message.author.avatarURL)
    .setTimestamp();
    
    let embed1 = new RichEmbed()
    .setColor('#f781c6')
    .setDescription('💟 Invite')
    .addField(`💌 | Meu convite`,`**• https://discordapp.com/api/oauth2/authorize?client_id=524949763674734602&permissions=8&scope=bot**`)
    .addField(`💌 | Meu suporte`,`**• https://discord.gg/7MqvwRz**`)
    .setImage("https://cdn.discordapp.com/emojis/534524312384962570.png?v=1")
    .setThumbnail(client.user.avatarURL)
    .setFooter(`Pedido por ${message.author.tag}`, message.author.avatarURL)
    .setTimestamp();

    message.member.send(embed)
        .then(async msg => {
            let arr = ['💌', '⬅'];
            for (let i = 0; i < arr.length; ++i) {
                await msg.react(arr[i]).catch(()=>{});
            }
            const collector = msg.createReactionCollector((r, u) => arr.some(e => e === r.emoji.name) && u.id === message.author.id);
            collector.on("collect", r => {
                switch (r.emoji.name) {
                    case '💌':
                        msg.edit(embed1).catch(()=>{});
                        break;
                    case'⬅':
                        msg.edit(embed).catch(()=>{});
                }
            });
            message.reply(`Meu invite está na sua **DM** amiguinho! <:legalzinho:535419312131801108>`).catch(()=>{});
        })
        .catch(()=>{});
};
