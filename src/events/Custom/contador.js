module.exports = (client, guild, contador) => {
    let txt = contador.text;
    if (!txt.length) txt = client.emojis.find(e => e.name === "comendo");
    let channel = guild.channels.find(c => c.id === contador._id);
    if (!channel) return 1;
    let string = `${client.emojis.find(e => e.name === "gamer")} Membros: `;
    string +=`${memberCountToText(client.getEmoji, guild.memberCount, contador.format)} ${txt}`;
    channel.setTopic(string, "Atualizando Contador").catch(()=>{});
};

var numberToEmoji = (number, format) => {
    return format === "0" ? `0${number}` : `${number}${format}`;
};

/**
 * Transforma `memberCount` em texto com emojis
 * @param {Number} memberCount Número de membros
 * @returns {String} Texto com emojis equivalente a `memberCount`
*/
var memberCountToText = (getEmoji, memberCount, format) => {
    let array = [];
    let size = Math.floor(Math.log10(memberCount));
    for (let i = size; i >= 0; --i) {
        array[i] = Math.floor(memberCount % 10);
        memberCount /= 10;
    }
    array.forEach((element, index, array) => {
        let emoji = numberToEmoji(element, format);
        array[index] = `${getEmoji(emoji)}`;
    });
    return array.join("");
};
