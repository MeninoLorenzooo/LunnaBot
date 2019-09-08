const { connect, model } = require("mongoose");
const { localDB, testDB } = require("./config.json");

connect(process.argv[2] === "test" ? testDB : localDB, { useNewUrlParser: true })
    .then(() => {
        console.log("Conectado ao banco de dados");
        global._topRankXP = [];
        global._topRankMoney = [];
        let allUsers = new Map();
        userProperties.find({}, "amountXP money").lean()
            .then(users => {
                if (!users) {
                    console.log("Tabela inexistente");
                    return;
                }
                for (let i = 0, length = users.length; i < length; ++i) {
                    allUsers.set(users[i]._id, {
                        amountXP: users[i].amountXP,
                        money: users[i].money
                    });
                }
                for (let [key, value] of allUsers) {
                    updateTopRankXp(key, value.amountXP);
                    updateTopRankMoney(key, value.money);
                }
                allUsers = null;
                console.log(`Top Rank e Top Money preparados`);
            })
            .catch(err => {
                console.error(err);
                console.log("Nao foi possivel iniciar o top rank de xp");
            });
        shop.findById("shop").lean()
            .then(shopTable => {
                if (!shopTable) {
                    console.log(`Criando loja na db`)
                    createNewShopEntry();
                } else {
                    console.log(`Conectado à loja`);
                }
            })
            .catch(err => {
                console.log(err);
                console.log(`Não foi possível acessar a loja`);
            });
    })
    .catch(err => {
        console.error(`Erro: ${err.errmsg || err}`);
        process.exit(1);
    });

const updateTopRankXp = (key, xp = 0) => {
    const MAX_LENGTH = 5;
    if (_topRankXP.length === 0) {
        _topRankXP.push({ id: key, xp });
        return;
    }
    for (let i = 0; i < _topRankXP.length; ++i) {
        if (xp > _topRankXP[i].xp) {
            _topRankXP.splice(i, 0, { id: key, xp });
            break;
        } else if (_topRankXP.length < MAX_LENGTH && i === _topRankXP.length - 1) {
            _topRankXP.push({ id: key, xp });
            break;
        }
    }
    while (_topRankXP.length > MAX_LENGTH) _topRankXP.pop();
};

const updateTopRankMoney = (key, money = 0) => {
    const MAX_LENGTH = 10;
    if (_topRankMoney.length === 0) {
        _topRankMoney.push({ id: key, money });
        return;
    }
    for (let i = 0; i < _topRankMoney.length; ++i) {
        if (money > _topRankMoney[i].money) {
            _topRankMoney.splice(i, 0, { id: key, money });
            break;
        } else if (_topRankMoney.length < MAX_LENGTH && i === _topRankMoney.length - 1) {
            _topRankMoney.push({ id: key, money });
            break;
        }
    }
    while (_topRankMoney.length > MAX_LENGTH) _topRankMoney.pop();
};

const {
    GuildSchema,
    ShopSchema,
    UserPropertiesSchema,
    BoxInfoSchema
} = require("./schemas.js");

const box = model("box", BoxInfoSchema);

const guild = model("guild", GuildSchema);

const shop = model("shop", ShopSchema);

const createNewShopEntry = (_id = "shop") => {
    let newShopEntry = new shop({ _id });
    console.log(newShopEntry);
    newShopEntry.save().catch(console.error);
};

const userProperties = model("userProperties", UserPropertiesSchema);

module.exports = {
    guild,
    userProperties,
    shop,
    box
};
