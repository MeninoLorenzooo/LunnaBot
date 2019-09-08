module.exports = async (client, message) => {
    var user = message.mentions.users.first() || message.author;

    if (user.presence.game && user.presence.game.name === 'Spotify' && user.presence.game.type === 2) {
        try {
            var trackImg = user.presence.game.assets.largeImageURL;
            var trackUrl = `https://open.spotify.com/track/${user.presence.game.syncID}`;
            var trackName = user.presence.game.details;
            var trackAlbum = user.presence.game.assets.largeText;
            var trackAuthor = user.presence.game.state;

            const { RichEmbed } = require('discord.js');
            const embed = new RichEmbed()
                .setAuthor('Spotify informação da música')
                .setColor('f781c6')
                .setThumbnail(trackImg)
                .setDescription(`\`🎵\` **Nome da música :**  \`${trackName}\`📀 **Álbum :**  \`${trackAlbum}\`🎤 **Autor(s) :**  \`${trackAuthor}\``)
                .addField('Ouça esta faixa :', `[${trackUrl}](${trackUrl})`, false);

            message.channel.send(embed).catch(()=>{});
        } catch (error) {
            message.channel.send(`\`[ERROR ❌]\`, ${user.username} may not be listening to a registered sound`).catch(()=>{});
        }
    } else {
        message.channel.send(`${user.username} is not listening to spotify`).catch(()=>{});
    }
};
