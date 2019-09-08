module.exports = async client => {
    console.log(`Logado como ${client.user.tag}`);
    console.log("\nO loop presence foi ativado!");
    while (1) {
        client.user.setActivity(
            `• ${client.users.size} Usuários Lindos (a) 💖`,
            { type: 'STREAMING', url: 'https://twitch.tv/nikoplayx' }
        ).catch(()=>{});
        await sleep(60000);
        client.user.setActivity(
            `• Comprem na minha Lojinha 🎒 use l!loja`,
            { type: 'STREAMING', url: 'https://twitch.tv/nikoplayx' }
        ).catch(()=>{});
        await sleep(60000);
        client.user.setActivity(
            `• Nhaw Pescando 🎣 l!pescar`,
            { type: 'STREAMING', url: 'https://twitch.tv/nikoplayx' }
        ).catch(()=>{});
        await sleep(60000);
        client.user.setActivity(
            `• Dúvidas ? • l!ajuda para meus comandos amiguinho(a) 💌 use l!invite para me colocar em seu servidor 💌`,
            { type: 'STREAMING', url: 'https://twitch.tv/nnikoplayx' }
        ).catch(()=>{});
        await sleep(80000);
        client.user.setActivity(
            `• Jukeraaa ... Yodaaaaa o que você tá fazendo menor? me ajuda skdkasd 😂`,
            { type: 'STREAMING', url: 'https://twitch.tv/jukes' }
        ).catch(()=>{});
        await sleep(100000);
        client.user.setActivity(
            `• Para ${client.guilds.size} Servidores! Obrigado a todos por me adicionarem 💖`,
            { type: 'STREAMING', url: 'https://twitch.tv/nikoplayx' }
        ).catch(()=>{});
        await sleep(100000);
    }
};

const sleep = time => new Promise(resolve => {
    setTimeout(resolve, time)
});
