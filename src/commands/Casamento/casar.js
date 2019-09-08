module.exports = async (client, message, args, prefix) => {
    let regexArray = /([0-9]{18})/.exec(args[0]);
    if (!regexArray || regexArray.length < 1) {
        return message.reply(`Modo de uso: \`${prefix}casar <mencao>\``).catch(()=>{});
    }
    let mentionedMember = await message.guild.fetchMember(regexArray[0]).catch(()=>{});
    if (!mentionedMember) {
        return message.reply(`Mencione um membro do servidor`).catch(()=>{});
    } else if (mentionedMember.user.bot) {
        return message.reply(`Você não pode casar com um bot`).catch(()=>{});
    }
    const { userProperties } = require("database.js");
    let author, proposed;
    try {
        [author, proposed] = await Promise.all([
            userProperties.findById(message.author.id),
            userProperties.findById(mentionedMember.id)
        ]);
    } catch (e) {
        message.reply("Erro").catch(()=>{});
        console.error(e);
    }

    author = Object.assign(new userProperties(), author);
    proposed = Object.assign(new userProperties(), proposed);
    if (checkMarriage(author)) {
        return message.reply(`Você já está casado(a)`).catch(()=>{});
    }
    if (checkMarriage(proposed)) {
        return message.reply(`${mentionedMember.user.tag} já está casado(a)`).catch(()=>{});
    }

    if (checkCooldown(message, author)) return;

    if (checkRings(author.items)) {
        return message.reply(`Você precisa de dois aneis de casamento para casar com alguém`).catch(()=>{});
    }

    let check = await validate(author, proposed, message);
    if (!check) return;

    author.items = removeRings(author.items);
    author.items = addRing(author.items);
    proposed.items = addRing(proposed.items);

    const timestamp = new Date() - 0;

    author.marriage.marriedTo = proposed._id;
    proposed.marriage.marriedTo = author._id;

    author.lastMarriageAttempt = timestamp;
    author.marriage.marriedTimestamp = timestamp;

    proposed.lastMarriageAttempt = timestamp;
    proposed.marriage.marriedTimestamp = timestamp;

    Promise.all([
        author.save(),
        proposed.save()
    ])
    .then(() => {
        const { RichEmbed } = require("discord.js");
        let embed = new RichEmbed()
        .setTitle("Casamento")
        .setDescription(`Parece que temos um novo casal 💘\n\n<@${author._id}> casou com <@${proposed._id}>`)
        .setColor("f781c6")
        .setImage("https://pa1.narvii.com/6598/2412e18914c7c74f84d5ba8cd5027987b6971b2e_hq.gif")
        .setTimestamp();
        message.channel.send(embed).catch(()=>{});
    })
    .catch(()=>{});
};

const checkMarriage = (user) => user.marriage.marriedTo.length > 0;

const checkCooldown = (message, author) => {
    const lastTimestamp = author.lastMarriageAttempt;
    const DAY = 24 * 60 * 60 * 1000;
    if ((message.createdTimestamp - lastTimestamp) >= DAY) return 0;
    const ms = require("ms");
    let time = ms(DAY - (message.createdTimestamp - lastTimestamp), { long: true });
    time = time.replace(/hour/g, "hora").replace(/minute/g, "minuto").replace(/second/g, "segundo");
    message.reply(`Você precisa esperar ${time} antes de tentar casar novamente`).catch(()=>{});
    return 1;
}

const checkRings = (items) => {
    for (let i = 0; i < items.length; ++i)
        if (items[i].id === "anel" && items[i].quantity >= 2)
            return 0;
    return 1;
}

const removeRings = (items) => {
    let ringIndex = items.findIndex(i => i._id === "anel");
    items[ringIndex].quantity -= 2;
    if (items[ringIndex].quantity === 0) {
        items.splice(ringIndex, 1);
    }
    return items;
};

const addRing = (items) => {
    if (items.some(i => i._id === "anel casamento")) return items;
    let marriageRing = {
        _id: "anel casamento",
        name: "💍 Anel de Casamento",
        price: 300,
        quantity: 1
    };
    items.splice(0, 0, marriageRing);
    return items;
}

const validate  = (author, proposed, message) => new Promise(async resolve => {
    const { RichEmbed } = require("discord.js");
    let questionEmbed = new RichEmbed()
        .setTitle("Pedido de casamento")
        .setDescription(`<@${proposed._id}> aceita casar com <@${author._id}> ?`)
        .setColor("f781c6");
    let msg = await message.channel.send(`<@${proposed._id}>`, questionEmbed).catch(() => resolve(false));

    let emojis = ["✅", "❌"];
    for (let i = 0; i < emojis.length; ++i) {
        await msg.react(emojis[i]).catch(()=>{});
    }
    const filter = (r, u) => emojis.includes(r.emoji.name) && u.id === proposed._id;
    const collector = msg.createReactionCollector(filter, { time: 60 * 1000 });
    collector.on("collect", reaction => {
        let emoji = reaction.emoji.name;
        collector.stop();
        msg.delete().catch(()=>{});
        if (emoji === "✅") resolve(true);
        if (emoji === "❌") resolve(false);
    });
});
