const { Schema } = require("mongoose");
const { prefix } = require("./config.json");

var RegistradorSchema = new Schema({
    _id: String,
    membrosRegistrados: [{
        _id: String,
        genero: String,
        timestamp: Number
    }]
});

var GuildSchema = new Schema({
    _id: String,
    contador: {
        _id: { type: String, default: "" },
        status: { type: Boolean, default: false },
        text: { type: String, default: "" },
        format: { type: String, default: "0" }
    },
    config: {
        autoVerificar: {
            _id: { type: String, default: "" },
            status: { type: Boolean, default: false },
        },
        filtroInvites: { type: Boolean, default: false },
        filtroBots : {
            _id: { type: String, default: "" },
            status: { type: Boolean, default: false },
        },
        masculino: { type: String, default: "" },
        feminino: { type: String, default: "" },
        n_binario: { type: String, default: "" },
        novato: { type: String, default: "" },
    },
    registradores: [RegistradorSchema],
    welcome: {
        welcome: {
            _id: { type: String, default: "" },
            text: { type: String, default: "${USER} Bem vindo ao servidor ${SERVER}" },
        },
        saida: {
            _id: { type: String, default: "" },
            text: { type: String, default: "${USER} saiu do servidor" },
        },
        privado: { type: String, default: "" }
    },
    eventlog: {
        _id: { type: String, default: "" },
        autoVerificar: { type: Boolean, default: false },
        ban: { type: Boolean, default: false },
        delet: { type: Boolean, default: false },
        edit: { type: Boolean, default: false },
        unban: { type: Boolean, default: false }
    },
    prefix: { type: String, default: prefix },
    blockBotsAuthor: { type: String, default: "" }
});

var ItemSchema = new Schema({
    _id: String,
    name: String,
    price: Number,
    quantity: Number
});

var ShopSchema = new Schema({
    _id: String,
    items: [ItemSchema]
});

var BoxInfoSchema = new Schema({
    _id: String,
    last: {
        guild: { type: String, default: "" },
        time: { type: Number, default: 0 }
    }
});

var UserPropertiesSchema = new Schema({
    _id: String,

    amountXP: { type: Number, default: 0 },
    lastXP: { type: Number, default: 0 },

    money: { type: Number, default: 0 },
    lastMining: { type: Number, default: 0 },

    lastDonationDay: { type: Number, default: 0 },
    donations: { type: Number, default: 0 },

    lastTransferDay: { type: Number, default: 0 },
    transfers: { type: Number, default: 0 },

    lastFishing: { type: Number, default: 0 },

    lastMarriageAttempt: { type: Number, default: 0 },
    marriage: {
        marriedTo: { type: String, default: "" },
        marriedTimestamp: {type: Number, default: 0 }
    },

    items: [ItemSchema]
});

module.exports = {
    GuildSchema,
    ShopSchema,
    UserPropertiesSchema,
    BoxInfoSchema
};
