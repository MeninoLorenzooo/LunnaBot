module.exports = (client, message, args, prefix) => {
    if (!message.member.hasPermission("ADMINISTRATOR", false, true, true)) {
        return message.reply("**Você não possui permissões para utilizar esse comando!**").catch(()=>{});
    }
    const { guild } = require("database.js");
    guild.findById(message.guild.id, "eventlog")
        .then(guildTable => {
            if (!guildTable) {
                guildTable = new guild({ _id: message.guild.id });
            }
            if (args.length < 1) {
                return client.logsUtils.default(client, message, args, prefix, guildTable);
            }
            var cmd = client.logsUtils[args[0]];
            if (cmd) {
                cmd(client, message, args, guildTable); 
            } else {
                client.logsUtils.typo(client, message, prefix);
            }
        })
        .catch(console.error);
};
