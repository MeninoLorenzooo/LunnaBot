module.exports = async (client, message) => {
    const moment = require("moment");
    const duration = moment.duration(client.uptime).locale("pt-BR").humanize();
    let botAvatar = client.user.displayAvatarURL;
    let userName = client.user.username;
    const { RichEmbed } = require("discord.js");
    let embed = new RichEmbed()
    .setDescription('**Minhas informações**')
    .setColor('#f781c6')
    .setThumbnail(botAvatar)
    .addField('• <:bochecha:518131515352154154> Sobre mim', 'sou um botzinho criado com muito amor! meu criador vem me deixando cada dia mais linda é cheia de utilidades, assim posso ajudar meus amiguinhos em seus servidores é cativar todos com meus comandos, espero que gostem de tudo! **Beijos da Lunna <:s2:518062797423247380>**')
    .addField('• <:gatinhoos2:518029263564439573> Meu nome', userName)
    .addField('• <a:oiii:519479795780812804> Olá amiguinho (a) Estou online a', duration)
    .addField('• <:olhando:518131518309400586> Criado em', 'Data: 30/11/2018 \nHorário: 7:48 Horário de Brásilia')
    .addField('• <:feliz:518131518648877090> Sexo:', 'Feminino')
    .addField('• <:nhow:518029263996452865> Criador:', '<@469458019655352320>')
    .addField('• <:banho:518131521832353792> Progresso do bot:', '10% Concluída [█..........]')
    .addField('• <:mec:518029264331997184> Servidores:', client.guilds.size)
    .addField('• <:gatinhoo:518029264113762307> Usuários:', client.users.size);

    message.channel.send(embed)
        .then(message => {
            message.delete(40000).catch(()=>{});
        })
        .catch(()=>{});
};
