module.exports = (client, message) => {
    const { userProperties } = require("database.js");
    userProperties.findById(message.author.id)
        .then(async author => {
            author = Object.assign(new userProperties(), author);
            let marriedTo = author.marriage.marriedTo;
            if (!marriedTo.length) {
                return message.reply("Você não está casado com ninguém").catch(()=>{});
            }
            if (!checkTime(message, author)) return;
            if (await validateDivorce(message, author, marriedTo) === false) return;
            userProperties.findById(marriedTo)
                .then(doc => {
                    doc = Object.assign(new userProperties(), doc);
                    divorce(message, author, doc);
                })
                .catch(err => {
                    message.reply(`Não foi possível efetuar o divórcio`).catch(()=>{});
                    console.error(err);
                });
        });
};

function checkTime (message, author) {
    const TWO_DAYS = 2 * 24 * 60 * 60 * 1000;
    let diff = message.createdTimestamp - author.marriage.marriedTimestamp;
    if (diff < TWO_DAYS ) {
        const ms = require("ms");
        var time = ms(TWO_DAYS - diff, { long: true });
        time = time.replace(/day/g, "dia").replace(/hour/g, "hora").replace(/minute/g, "minuto").replace(/second/g, "segundo");
        message.reply(`Você tem que esperar ${time} antes de se divorciar`).catch(()=>{});
        return false;
    } else {
        return true;
    }
}

function validateDivorce (message, author, marriedTo) {
    const { RichEmbed } = require("discord.js");
    return new Promise(resolve => {
        let questionEmbed = new RichEmbed()
        .setTitle("Confirmação de Divórcio")
        .setDescription(`<@${author._id}> tem certeza que deseja se divorciar de <@${marriedTo}> ?`)
        .setColor("f781c6");
        message.channel.send(`<@${author._id}>`, questionEmbed)
            .then(async msg => {
                let emojis = ["✅", "❌"];
                for (let i = 0; i < emojis.length; ++i) {
                    await msg.react(emojis[i]).catch(()=>{});
                }
                const filter = (r, u) => emojis.some(e => e === r.emoji.name) && u.id === author._id;
                const collector = msg.createReactionCollector(filter, { time: 60 * 1000 });
                collector.on("collect", reaction => {
                    let emoji = reaction.emoji.name;
                    if (emoji === "✅") {
                        collector.stop();
                        msg.delete().catch(()=>{});
                        resolve(true);
                    }
                    if (emoji === "❌") {
                        collector.stop();
                        msg.delete().catch(()=>{});
                        resolve(false);
                    }
                });
            })
            .catch(() => {
                resolve(false);
            });
    });
}

function divorce (message, author, marriedTo) {
    author.marriage.marriedTo = "";
    marriedTo.marriage.marriedTo = "";

    author.items = removeRing(author.items);
    marriedTo.items = removeRing(marriedTo.items);

    Promise.all([
        author.save(),
        marriedTo.save()
    ])
    .then(() => {
        const { RichEmbed } = require("discord.js");
        let embed = new RichEmbed()
        .setTitle(`Divórcio`)
        .setDescription(`<@${author._id}> e <@${marriedTo._id}> se divorciaram`)
        .setColor("f781c6")
        .setTimestamp();
        message.channel.send(embed).catch(()=>{});
    })
    .catch(err => {
        message.reply(`Não foi possível efetuar o divórcio`).catch(()=>{});
        console.error(err);
    });
}

function removeRing(items) {
    let ringIndex = items.findIndex(i => i._id === "anel casamento");
    if (ringIndex >= 0) items.splice(ringIndex, 1);
    return items;
}
