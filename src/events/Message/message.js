module.exports = (client, message) => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;
    client.emit("xpManager", message);
    client.emit("spawnManager", message);
    const { guild } = require("database.js");
    guild.findById(message.guild.id, "prefix config").lean()
        .then(async guildTable => {
            var { prefix } = require("config.json");
            if (guildTable) {
                prefix = guildTable.prefix
            } else {
                let newGuild = new guild({ _id: message.guild.id });
                await newGuild.save().catch(console.error);
            }
            mentionAndCommandHandling(client, message, prefix);
            if (!guildTable || !guildTable.config) return;
            if (guildTable.config.filtroInvites && !message.member.hasPermission("ADMINISTRATOR", false, true, true)) {
                worstFiltro(client, message);
            }
        })
        .catch(console.error);
};

var mentionAndCommandHandling = (client, message, prefix) => {
    if (message.content.startsWith(prefix)) {
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();
        const cmd = client.commands[command];
        if (cmd) cmd(client, message, args, prefix);
    } else {
        if (message.mentions.members.size < 1) return;
        let mention = message.content.split(/ +/g)[0];
        if (mention === `<@${client.user.id}>` || mention === `<@!${client.user.id}>`) {
            message.reply(
                `Meu prefixo atual é: **${prefix}** | ` +
                `Use: ${prefix}prefixo <prefixo> para alterar!`
            )
            .then(m => {
                m.delete(5000).catch(()=>{});
            })
            .catch(()=>{});
        }
    }
};

const min3 = 180000;

/**
 * Esse é o pior filtro que você vai ver em toda sua vida 
 * Obviamente é temporario e não deve ser usado por motivos óbvios
 * Mas se você quiser arriscar ta aí
*/
var worstFiltro = async ({ getEmoji, inviteFilter }, message) => {
    if (!/discord\.gg\/[\d\w]/.test(message.content)) return;
    let guildFilter = inviteFilter.get(message.guild.id);
    if (guildFilter) {
        let user = guildFilter.get(message.author.id);
        if (user) {
            user.num += 1;
            if (user.timestamp - message.createdTimestamp <= min3) {
                user.timestamp = message.createdTimestamp;
                clearTimeout(user.timeoutID);
                user.timeoutID = setTimeout(() => {
                    deleteUserEntry(inviteFilter, message);
                }, min3);
            }
            if (user.num >= 3) {
                let muteRole = message.guild.roles.find(r => r.name === "Lunna Muted");
                if (!muteRole) muteRole = await message.guild.createRole({ name: "Lunna Muted"}).catch(()=>{});
                if (muteRole) {
                    message.member.addRole(muteRole).catch(()=>{});
                    message.guild.channels.forEach(channel => {
                        channel.overwritePermissions(muteRole, {
                            SEND_MESSAGES: false,
                            ADD_REACTIONS: false,
                            SPEAK: false
                        }).catch(()=>{});
                    });
                }
                deleteUserEntry(inviteFilter, message);
            }
        } else {
            guildFilter.set(message.author.id, setObj(inviteFilter, message));
        }
    } else {
        inviteFilter.set(message.guild.id, new Map());
        let filtro = inviteFilter.get(message.guild.id);
        filtro.set(message.author.id, setObj(inviteFilter, message));  
    }
    message.delete().catch(()=>{});
    message.reply(`${getEmoji("noswift")} Você não pode enviar convites de outros servidores aqui!`).catch(()=>{}); 
};

var setObj = (inviteFilter, message) => {
    let timeoutID = setTimeout(() => deleteUserEntry(inviteFilter, message), min3);
    return { num: 1, timestamp: message.createdTimestamp, timeoutID };
};

var deleteUserEntry = (inviteFilter, message) => {
    let guild = inviteFilter.get(message.guild.id);
    let user = guild.get(message.author.id);
    clearTimeout(user.timeoutID);
    if (guild.size === 1) {
        inviteFilter.delete(message.guild.id);
    } else {
        guild.delete(message.author.id);
    }
};
