module.exports = async (client, message, args, prefix) => {
    if (args.length < 1) {
        return message.reply(
            "Você esqueceu de colocar os parâmetros!\n" +
            `Use: ${prefix}bot info/status/ping ${client.getEmoji("oiii")}`
        ).catch(()=>{});
    }
    const { RichEmbed } = require("discord.js");
    switch (args[0]) {
        case "info":
            var currTime = message.createdTimestamp;
            var texto = getTimeSinceReady(client, currTime);
            var embed = new RichEmbed()
            .setDescription("**Informações do bot**")
            .setThumbnail(client.user.avatarURL)
            .addField('• <:bochecha:518131515352154154> Sobre mim', 'sou um botzinho criado com muito amor! meu criador vem me deixando cada dia mais linda é cheia de utilidades, assim posso ajudar meus amiguinhos em seus servidores é cativar todos com meus comandos, espero que gostem de tudo! **Beijos da Lunna <:s2:518062797423247380>**')
            .addField('• <:gatinhoos2:518029263564439573> Meu nome', 'Lunna')
            .addField('• <:olhando:518131518309400586> Criado em', 'Data: 30/11/2018 \nHorário: 7:48 Horário de Brásilia')
            .addField('• <:feliz:518131518648877090> Sexo:', 'Feminino')
            .addField('• <:nhow:518029263996452865> Criador:', '<@469458019655352320>')
            .addField('• <:banho:518131521832353792> Progresso do bot:', '18% Concluída [█..........]')
            .addField('• <:mec:518029264331997184> Servidores:', client.guilds.size)
            .addField('• <:gatinhoo:518029264113762307> Usuários:', client.users.size)
            .addField("• <:danar:518131518301011979> Minhas Tags", client.user.tag, true)
            .addField(`• <a:oiii:519479795780812804> Estou online a`, `\`${texto}\``, false)
            .setColor("f781c6");
            message.channel.send(embed).catch(()=>{});
        break;
        case "status":
            var texto = getTimeSinceReady(client, message.createdTimestamp);
            var embed = new RichEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL)
            .setDescription(`**• Olá, está com duvidas? [Servidor de Suporte!](https://discord.gg/Vkhyxv5)**`)
            .addField(`${client.getEmoji("EmoteRefresh")}Uptime`, `\`${texto}\``)
            .addField(`${client.getEmoji("discord")} Servidores Conectados`, "```js\n2,502```")
            .addField(`${client.getEmoji("EmoteChannel")} Canais de texto`, "```js\n36,778```" , true)
            .addField(`${client.getEmoji("sons")} Canais de voz`, "```js\n37,232```", true)
            .addField("membros Usuários", "```md\n# 322,428```" , true)
            .addField(`${client.getEmoji("carregando")} Ping`, `\`\`\`js\n${Math.round(client.ping)}\`\`\``, true)
            .addField(`${client.getEmoji("EmoteConfig")} Memoria`, "```js\n276.93```", true)
            .addField(`**${client.getEmoji("buscar")} Região:**`, "```md\n#brazil```", true)
            .addField(client.getEmoji("olhando"),
                `**${client.getEmoji("gatinhoo")}[adicione-me em seu servidor](https://discordapp.com/api/oauth2/authorize?client_id=518026456282955776&permissions=8&scope=bot)**`, true)
            .setColor("f781c6")
            .setFooter(message.guild.name, message.guild.iconURL)
            .setTimestamp();
            message.channel.send(embed).catch(()=>{});
        break;
        case "ping":
            // Wtf
            client.commands.ping(client, message);
        break;
        default:
            message.reply(`Você digitou errado!\nUse: ${prefix}bot info/status/ping ${client.getEmoji("banho")}`).catch(()=>{});
        break;
    }
};

/**
 * Tempo que o bot está rodando
 * @param {EventEmitter} client O bot que está rodando o programa
 * @param {Number} currTime Timestamp atual
*/
var getTimeSinceReady = (client, currTime) => {
    let texto =  "";
    let secs = (currTime - client.readyTimestamp) / 1000;
    let min = secs / 60;
    secs = Math.floor(secs % 60);
    let hours = Math.floor(min / 60);
    min = Math.floor(min % 60);
    var setSecs = (texto, secs) => {
        return texto += `${secs} segundos`;
    };
    var setMin = (texto, min, secs) => {
        if (min === 1)
            texto += `${min} minuto e `;
        else
            texto += `${min} minutos e `;
        return setSecs(texto, secs);
    };
    var setHours = (texto, hours, min, secs) => {
        if (hours === 1)
            texto += `${hours} hora e `;
        else
            texto += `${hours} horas e `;
        return setMin(texto, min, secs);
    };
    if (hours > 0) {
        texto = setHours(texto, hours, min, secs);
    }
    else if (min > 0) {
        texto = setMin(texto, min, secs);
    }
    else if (secs > 0) {
        texto = setSecs(texto, secs);
    }
    return texto;
};
