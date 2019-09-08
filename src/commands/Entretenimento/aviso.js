module.exports = async (client, message, args) => {
    if (!args.slice(0).join(' ')) return message.reply('Diga o que você quer falar!').catch(()=>{});
    message.channel.send({
        embed: {
            description: args.slice(0).join(' '),
            color: message.member.highestRole.color,
        }
    });
    message.delete().catch(()=>{});
};
