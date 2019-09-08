module.exports = async (client, message) => {
    const moment = require("moment");
    require("moment-duration-format");
    let duration = moment.duration(client.uptime).format('D [d], H [h], m [m], s [s]');
    let nomeEApelido = message.guild.member(message.author.id).nickname || message.author.username;
    message.channel.send(`**${nomeEApelido}**, estou online à: **${duration}**`).catch(()=>{});
}
