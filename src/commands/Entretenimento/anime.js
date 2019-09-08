module.exports = async (client, message, args) => {
    const search = `${args}`;

    const malScraper = require('mal-scraper');
    malScraper.getInfoFromName(search).then(data => {
        const { RichEmbed } = require("discord.js");
        const malEmbed = new RichEmbed()
        .setAuthor(`Meu resultado de pesquisa de lista de animes para ${args}`.split(',').join(' '))
        .setThumbnail(data.picture)
        .setColor('#f781c6') //I personally use bubblegum pink!
        .addField('Titulo em Inglês', data.englishTitle, true)
        .addField('Titulo em Japonês', data.japaneseTitle, true)
        .addField('Tipo', data.type, true)
        .addField('Episódios', data.episodes, true)
        .addField('Avaliação', data.rating, true)
        .addField('Lançado Em', data.aired, true)
        .addField('Ponto', data.score, true)
        .addField('Status de Pontuação', data.scoreStats, true)
        .addField('Link', data.url);
        message.channel.send(malEmbed).catch(()=>{});
    }).catch(()=>{});
};
