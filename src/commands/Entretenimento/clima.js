module.exports = async (client, message, args) => {
    const tempo = require('weather-js');
    tempo.find({ search: args.join(" "), degreeType: 'C' }, (err, result) => {
        if (err) return message.channel.send(err).catch(()=>{});

        if (result.length === 0) {
            message.channel.send('Selecione uma cidade para pesquisar o tempo!' ).catch(()=>{});
            return;
        }

        var Tempo = result[0].current; 
        var Local = result[0].location;

        const { RichEmbed } = require('discord.js');
        let embed = new RichEmbed()
            .setColor(`#f781c6`)
            .setAuthor(`Tempo de ${Tempo.observationpoint}`)
            .setTitle("Lunna - Clima")
            .addField('<a:carregando:489775219339165703> Fuso horário :', `${Local.timezone} UTC`, true)
            .addField('<a:vento:489772851625328654> Tipo de grau :', Local.degreetype, true)
            .addField('<:Ocupado:484132926833950720> Temperatura atual:', `${Tempo.temperature} graus`, true)
            .addField('<:EmoteRefresh:485917219360866326> Em torno dos:', `${Tempo.feelslike} graus`, true)
            .addField('<a:nuvem:489772854989291541> Ventos:', Tempo.winddisplay, true)
            .addField('<a:nuvem:489772854989291541> Umidade do Ar:', `${Tempo.humidity}%`, true)
            .setTimestamp()
            .setFooter(message.author.tag, message.author.displayAvatarURL);
        message.channel.send(embed).catch(()=>{});
    });
};
