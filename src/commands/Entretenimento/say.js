module.exports = (client, message, args) => {
    if (!args.join(" ")) return message.reply("Digite alguma coisa.").catch(()=>{});
    let say = args.join(' ');
    message.mentions.users.forEach(u => say = say.replace(`${u}`, `@${u.tag}`));
    message.mentions.roles.forEach(r => say = say.replace(`${r}`, `@${r.name}`));
    message.channel.send(say, {disableEveryone: true}).catch(()=>{});
};
