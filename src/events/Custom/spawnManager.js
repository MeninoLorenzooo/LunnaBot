const { box } = require("database.js");
const HOUR = 60 * 60 * 1000;

var spawningBox = false;

module.exports = (client, message) => {
    // chance to spawn = 5%
    if (Math.floor(Math.random() * 101) < 95) return;
    if (filter(message)) return;
    if (spawningBox) return;
    spawningBox = true;
    box.findById("caixa")
        .then(caixa => {
            if (!caixa || message.guild.id === caixa.last.guild || (new Date() - 0) - HOUR < caixa.last.time) {
                spawningBox = false;
                return;
            }
            
            let perms = message.channel.permissionOverwrites;
            /**
             * Checks if the `SEND_MESSAGES` or `READ_MESSAGES` permissions is denied to `@everyone` role
            */
            if (perms && perms.get(message.guild.id)) {
                let everyonePerm = perms.get(message.guild.id);
                let blocked = (everyonePerm.deny & 0x400) > 0 || (everyonePerm.deny & 0x800) > 0;
                if (blocked) {
                    spawningBox = false;
                    return;
                }
            }
            spawnBox(message, caixa);
        })
        .catch(err => {
            spawningBox = false;
            console.error(err);
        });
};

const blockedGuilds = [
    "264445053596991498"
];

function filter ({ guild }) {
    if (!guild || !guild.available || blockedGuilds.some(i => i === guild.id)) return 1;
    if (guild.memberCount < 50) return 1;
    return 0;
}

function spawnBox(message, caixa) {
    const { RichEmbed } = require("discord.js");
    let text = "Use `l!caixa` para concorrer à caixa\nCompetidores: ";

    let embed = new RichEmbed()
    .setTitle(`Uma caixa surpresa apareceu!`)
    .setDescription(text)
    .setColor("F781C6")
    .setTimestamp();

    message.channel.send(embed)
        .then(msg => {
            const filter = m => m.content.startsWith(`l!caixa`);
            const collector = msg.channel.createMessageCollector(filter);
            let competitors = [];
            setTimeout(() => collector.stop(), 30000);
            collector.on("collect", m => {
                if (competitors.length > 50) collector.stop();
                if (!competitors.some(i => i === m.author.id)) {
                    text += `${m.author}, `;
                    embed.setDescription(text);
                    msg.edit(embed).catch(()=>{});
                    competitors.push(m.author.id);
                }
            });
            collector.on("end", () => {
                msg.delete().catch(()=>{});
                if (competitors.length) sortAndGiveBox(message, caixa, competitors);
                else spawnBox = false;
            });
        })
        .catch(() => spawnBox = false);
}

function sortAndGiveBox (message, caixa, competitors) {
    const randomIndex = Math.floor(Math.random() * competitors.length);
    const choosenOne = competitors[randomIndex];
    if (!choosenOne) {
        spawnBox = false;
        return;
    }
    message.channel.send(`<@${choosenOne}>, Você ganhou uma caixa surpresa`).catch(()=>{});

    const { userProperties } = require("database.js");
    userProperties.findById(choosenOne)
        .then(user => {
            let boxIndex = user.items.findIndex(i => i._id === "caixa");
            if (boxIndex >= 0) {
                user.items[boxIndex].quantity += 1;
            } else {
                user.items.push({
                    _id: "caixa",
                    name: `:gift: | Caixa Surpresa`,
                    price: 0,
                    quantity: 1
                });
            }
            user.save()
                .then(() => {
                    caixa.last.time = message.createdTimestamp;
                    caixa.last.guild = message.guild.id;
                    caixa.save().catch(console.error);
                });
        })
        .catch(console.error)
    spawningBox = false;
}
