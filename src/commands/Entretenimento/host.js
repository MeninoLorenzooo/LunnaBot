module.exports = async (client, message) => {
    const { version } = require("discord.js");
    const { usagePercent } = require("cpu-stat");
    usagePercent((err, percent) => {
        if (err) {
            return console.log(err);
        }
        const moment = require("moment");
        moment.locale('pt-BR');
        const { cpus, totalmem, arch, platform } = require('os');
        const { RichEmbed } = require("discord.js");
        let embedStats = new RichEmbed()
        .setTitle("**| Informações sobre a VPS**")
        .setColor("#f781c6")
        .addField("<a:carregando:489775219339165703> • Memoria a ser usada",
                  `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} / ${(totalmem() / 1024 / 1024).toFixed(2)} MB`, true)
        .addField("<:js:517670124291883008> • Discord.js", `v${version}`, true)
        .addField("<a:carregando:487622785443561473> • CPU", `\`\`\`md\n${cpus().map(i => `${i.model}`)[0]}\`\`\``)
        .addField("<a:carregando:487622785443561473> • CPU a ser usada", `\`${percent.toFixed(2)}%\``,true)
        .addField("<:EmoteAtt:485912371412598785> • Arch", `\`${arch()}\``,true)
        .addField("<:EmoteConfig:486869372162539520> • Plataforma", `\`\`${platform()}\`\``,true)
        message.channel.send(embedStats).catch(()=>{});
    });
};
