process.env.NODE_PATH = __dirname;
require('module').Module._initPaths();

const {} = require("database.js");
const { Client, Collection} = require("discord.js");
const { token, testToken } = require("config.json");
const { readdirSync } = require("fs");
require('events').EventEmitter.defaultMaxListeners = 400;

const client = new Client({
    messageCacheLifetime: 600,
    messageSweepInterval: 500,
    disabledEvents: [
        "TYPING_START"
    ]
});

client.inviteFilter = new Map();

client.mutes = {};
client.getEmoji = emoji => client.emojis.find(e => e.name === emoji);

const commands = readdirSync("./src/commands");

client.commands = new Collection();

commands.forEach(folder => {
    if (folder === ".DS_Store") return;
    var all = readdirSync(`./src/commands/${folder}`, { withFileTypes: true });
    var files = all.filter(f => f.name.split('.').slice(-1)[0] === "js" && !f.isDirectory());
    files.forEach(file => {
        let name = file.name.split('.')[0];
        let exported = require(`./src/commands/${folder}/${file.name}`);
        client.commands[name] = exported;
        delete require.cache[require.resolve(`./src/commands/${folder}/${file.name}`)];
    });
    var utils = all.filter(f => f.isDirectory());
    utils.forEach(subFolder => {
        client[subFolder.name] = new Collection();
        var subFiles = readdirSync(`./src/commands/${folder}/${subFolder.name}`);
        subFiles = subFiles.filter(f => f.split('.').slice(-1)[0] === "js");
        subFiles.forEach(subFile => {
            let name = subFile.split('.')[0];
            let exported = require(`./src/commands/${folder}/${subFolder.name}/${subFile}`);
            client[subFolder.name][name] = exported;
            delete require.cache[require.resolve(`./src/commands/${folder}/${subFolder.name}/${subFile}`)];
        });
    });
});

const events = readdirSync("./src/events");

events.forEach(folder => {
    var files = readdirSync(`./src/events/${folder}`);
    files = files.filter(f => f.split('.').slice(-1)[0] === "js");
    files.forEach(file => {
        let name = file.split('.')[0];
        let exported = require(`./src/events/${folder}/${file}`);
        client.on(name, exported.bind(null, client));
        delete require.cache[require.resolve(`./src/events/${folder}/${file}`)];
    });
});

client.login(process.argv[2] === "test" ? testToken : token)
    .then(() => {
        console.log(`\nIniciando bot ${process.argv[2] === "test" ? "de testes" : "normal"}\n`)
    })
    .catch(console.error);
