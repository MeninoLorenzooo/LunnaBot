module.exports = (client, message) => {
    const { userProperties } = require("database.js");
    userProperties.findById(message.author.id, "amountXP").lean()
        .then(async userXPEntry => {
            let amountXP = 0;
            let level = 0;
            if (userXPEntry) {
                amountXP = userXPEntry.amountXP;
                level = client.xpUtils.level(amountXP);
            }
            let nextLevelXP = forNext(level);
            const { RichEmbed } = require("discord.js");
            let embed = new RichEmbed()
            .setTitle("Perfil | XP")
            .setThumbnail(message.author.displayAvatarURL)
            .setDescription(
                `<a:nitro:529635717626724354> Nível atual: \`${level}\`\n` +
                `<:exred:529635602031968277> Xp atual: \`${amountXP}\`\n` +
                `<a:carregando:489775219339165703> Quantidade de xp para o próximo nível: \`${nextLevelXP - amountXP}\``
            )
            .setColor("f781c6");
            await message.channel.send(embed).catch(()=>{});
        })
        .catch(console.error);
};

var forNext = (level) => {
    let _CURVE = 0.1;
    return Math.trunc(Math.pow((level + 1) / _CURVE, 2)) + 1;
};
