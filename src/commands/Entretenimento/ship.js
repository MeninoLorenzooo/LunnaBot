module.exports = async (client, message, args) => {
    try {
        // requer biblioteca Jimp
        var Jimp = require('jimp');

        // pegar os dados de cada posição dos args
        var mention_1 = args[0];
        var mention_2 = args[1];

        if (!mention_1 || !mention_2) {
            message.channel.send(`${message.author}, Informe os parâmetros corretamente \`l!ship @mention + @mention\``);
            return;
        }

        var mention_tratado = mention_1.replace('<','').replace('>','').replace('@','').replace('!','');
        var mention_tratado_2 = mention_2.replace('<','').replace('>','').replace('@','').replace('!','');
        var username_ship_1 = message.guild.member(mention_tratado || message.guild.members.get(args[0]));
        var username_ship_2 = message.guild.member(mention_tratado_2 || message.guild.members.get(args[1]));

        if (username_ship_1 === null || username_ship_2 === null) {
            message.channel.send(`${message.author}, Informe os parâmetros corretamente \`l!ship @mention + @mention\``);
            return;
        }

        // porcentagem do ship
        var random_ship = Math.floor((Math.random() * 100) + 1);

        // imagens do coração
        var imagens_ships = [
            'https://i.imgur.com/y7qZQS3.png',
            'https://images.emojiterra.com/twitter/v11/512px/2764.png',
            'https://images.emojiterra.com/google/android-pie/512px/1f494.png'
        ]; // array dos diretorios das imagens

        // esta variável possui a função de marcar a posição do array para que assim ele receba valor daquela posição como segue em baixo nas condições
        var valor_img = 0;

        /// tratar os usernames dos membros

        // remover 80% das palavras do usuario para que possa forma uma com as duas
        var username_shippado_1 = username_ship_1.user.username.substring(4, 0);

        // remover 80% das palavras do usuario para que possa forma uma com as duas
        var username_shippado_2 = username_ship_2.user.username.substring(4, 8);

        // resultado da palavra formada com as duas username_shippado_1 + username_shippado_2
        var shipps = username_shippado_1 + username_shippado_2;

        if (1 < random_ship && random_ship <= 20) valor_img = 2;
        else if (20 < random_ship && random_ship <= 50) valor_img = 1;
        else if (50 < random_ship && random_ship <= 100) valor_img = 0;

        let mensagem = `Vamos consultar o Cupido! <:coracao:489671058035834891>\n`;

        if (random_ship > 1 && random_ship <= 15) {
            mensagem += `***${random_ship}%*** \`[█..........]\`\n` +
                        `\`${username_ship_1.user.username} + ${username_ship_2.user.username} = ${shipps}\`\n` +
                        `Relaxa, existem outros peixes no cosmo! Não, pera.`;
        }
        if (random_ship > 15 && random_ship <= 20) {
            mensagem += `***${random_ship}%*** \`[██.........]\`\n` +
                        `\`${username_ship_1.user.username} + ${username_ship_2.user.username} = ${shipps}\`\n` +
                        `É, pelo visto vocês não seriam um bom casal. :/`;
        }
        if (random_ship > 20 && random_ship <= 30) {
            mensagem += `***${random_ship}%*** \`[███........]\`\n` +
                        `\`${username_ship_1.user.username} + ${username_ship_2.user.username} = ${shipps}\`\n` +
                        `Famosa friend zone`;
        }
        if (random_ship > 30 && random_ship <= 40) {
            mensagem += `***${random_ship}%*** \`[████.......]\`\n` +
                        `\`${username_ship_1.user.username} + ${username_ship_2.user.username} = ${shipps}\`\n` +
                        `Olha olha colega, vou até mandar uma cantada ` +
                        `"Garota, é mais fácil o Vasco não ser rebaixado do que eu te abandonar.":heart:`;
        }
        if (random_ship > 40 && random_ship <= 50) {
            mensagem += `***${random_ship}%*** \`[█████......]\`\n` +
                        `\`${username_ship_1.user.username} + ${username_ship_2.user.username} = ${shipps}\`\n` +
                        `Bom, pode correr atrás que um dia vocês estarão juntos... :heart: :smile:`;
        }
        if (random_ship > 50 && random_ship <= 60) {
            mensagem += `***${random_ship}%*** \`[██████.....]\`\n` +
                        `\`${username_ship_1.user.username} + ${username_ship_2.user.username} = ${shipps}\`\n` +
                        `50/50 em.... :smiling_imp:`;
        }
        if (random_ship > 60 && random_ship <= 70) {
            mensagem += `***${random_ship}%*** \`[███████....]\`\n` +
                        `\`${username_ship_1.user.username} + ${username_ship_2.user.username} = ${shipps}\`\n` +
                        `Vocês podem ter uma bela relação juntos em uma amizade saudável`;
        }
        if (random_ship > 70 && random_ship <= 80) {
            mensagem += `***${random_ship}%*** \`[████████...]\`\n` +
                        `\`${username_ship_1.user.username} + ${username_ship_2.user.username} = ${shipps}\`\n` +
                        `Santa Atena! Vocês dois já deveriam estar juntos há tempo! :smile:`;
        }
        if (random_ship > 80 && random_ship <= 90) {
            mensagem += `***${random_ship}%*** \`[█████████..]\`\n` +
                        `\`${username_ship_1.user.username} + ${username_ship_2.user.username} = ${shipps}\`\n` +
                        `Só vai, nem precisa mais usar o comando. Só vai.`;
        }
        if (random_ship > 90 && random_ship <= 100) {
            mensagem += `***${random_ship}%*** \`[███████████]\`\n` +
                        `\`${username_ship_1.user.username} + ${username_ship_2.user.username} = ${shipps}\`\n` +
                        `<a:fogo:502337581472677888> <a:coracon:502345295322021898> Vocês foram unidos pelo cosmos! ` +
                        `<a:coracon:502345295322021898> <a:fogo:502337581472677888>`;
        }

        // Utilizando Jimp para gerar o ship (é preciso que você crie suas imagens para colocar no lugar destes comentado)
        Promise.all([
            Jimp.read('https://cdn.discordapp.com/attachments/533429245930766338/537795069021913108/b751abae3f1c59af.png'),
            Jimp.read(imagens_ships[valor_img]),
            Jimp.read(username_ship_1.user.displayAvatarURL),
            Jimp.read(username_ship_2.user.displayAvatarURL)
        ])
        .then(([image, imageTwo, imageThree, imageFour]) => {
            imageTwo.resize(129 , 129);
            imageThree.resize(129, 129);
            imageFour.resize(129,129);
            image.blit(imageTwo,   129,                        Jimp.HORIZONTAL_ALIGN_CENTER)
                 .blit(imageThree, Jimp.HORIZONTAL_ALIGN_LEFT, Jimp.HORIZONTAL_ALIGN_CENTER)
                 .blit(imageFour,  260,                        Jimp.HORIZONTAL_ALIGN_CENTER)
                 .quality(100).write('./milo1.png');// exemplo (.img/eduardo.png)
            // mandar o resultado do comando por fim
            message.channel.send(mensagem, { files: ['./milo1.png'] });
        });
    } catch (error) {
        message.channel.send(`${message.author}, houve um erro ao executar este comando :frowning:, desculpe pela incoveniência estou reportando para o suporte!`);
        console.log(error);
    }
};
