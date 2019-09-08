module.exports = async (client, message) => {
    const top = client.guilds.sort((a, b) => b.memberCount - a.memberCount).array();
    let string = "";
    for (let i = 0, length = Math.min(top.length, 10); i < length; ++i) {
        string += `${i + 1}. **${top[i].name}**: ${top[i].memberCount}\n`;
    }
    message.channel.send(string).catch(()=>{});
};
