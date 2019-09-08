const minXP = 15, maxXP = 20;

module.exports = (client, message) => {
    const { userProperties } = require("database.js");
    userProperties.findById(message.author.id, "amountXP lastXP")
        .then(userPropertiesEntry => {
            if (!userPropertiesEntry) {
                let newEntry = new userProperties({ _id: message.author.id });
                newEntry.save().catch(()=>{});
                return;
            }
            let timeDifferenceInSeconds = userPropertiesEntry.lastXP ? (message.createdTimestamp - userPropertiesEntry.lastXP) / 1000 : 30;
            if (timeDifferenceInSeconds < 30) return;
            let randomAmount = getRandomInt(minXP, maxXP);
            userPropertiesEntry.amountXP += randomAmount;
            userPropertiesEntry.lastXP = message.createdTimestamp;
            userPropertiesEntry.save()
                .then(() => {
                    if (client.xpUtils.leveledUp(userPropertiesEntry.amountXP - randomAmount, userPropertiesEntry.amountXP)) {
                        message.reply(`<:legalzinho:535419312131801108> Parabéns, você subiu para o nível ${client.xpUtils.level(userPropertiesEntry.amountXP)} <:yes:529635602283626516>`)
                            .catch(()=>{});
                    }
                    updateTopRankXP(userPropertiesEntry);
                })
                .catch(()=>{});
        })
        .catch(console.error);
};

var updateTopRankXP = ({ _id, amountXP }) => {
    const MAX_LENGTH = 5;
    if (_topRankXP.length === 0) {
        _topRankXP.push({ id: _id, xp: amountXP });
        return;
    }
    if (amountXP <= _topRankXP[_topRankXP.length - 1].xp) return;
    removeDuplicateEntry(_id);
    for (let i = 0; i < _topRankXP.length; ++i) {
        if (_topRankXP[i].id === _id) {
            _topRankXP[i].xp = amountXP;
            break;
        } else if (amountXP > _topRankXP[i].xp) {
            _topRankXP.splice(i, 0, { id: _id, xp: amountXP });
            break;
        } else if (_topRankXP.length < MAX_LENGTH && i === _topRankXP.length - 1) {
            _topRankXP.push({ id: _id, xp: amountXP });
            break;
        }
    }
    while (_topRankXP.length > MAX_LENGTH) _topRankXP.pop();
}

var removeDuplicateEntry = (id, index = 0) => {
    for (let i = index; i < _topRankXP.length; ++i) {
        if (_topRankXP[i].id === id) {
            _topRankXP.splice(i, 1);
        }
    }
};

var getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
