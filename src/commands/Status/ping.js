module.exports = async (client, message) => {
    const { RichEmbed } = require("discord.js");
    let embed = new RichEmbed()
    .setTitle(" Meu ping!")
    .setColor("#f781c6")
    .setDescription(`**Meu ping é de** ${Math.round(client.ping)}ms! <a:carregando:489775219339165703>`)
    .setFooter(`Comando de ping`, client.user.displayAvatarURL);
    message.channel.send(embed).catch(()=>{});
};
