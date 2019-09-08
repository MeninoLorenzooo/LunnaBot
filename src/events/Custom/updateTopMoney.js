module.exports = (client, { _id, money }) => {
    if (_topRankMoney.length === 0) {
        _topRankMoney.push({ id: _id, money });
        return;
    }
    if (money <= _topRankMoney[_topRankMoney.length - 1].money) {
        return removeDuplicateEntry(_id) && recalculateTopMoneyRank(money);
    }
    updateMoneyRank({_id, money});
};

var recalculateTopMoneyRank = minMoney => {
    let allValidUsers = [];
    const { userProperties } = require("database.js");
    userProperties.find({}, "money")
        .then(users => {
            for (let i = 0, length = users.length; i < length; ++i) {
                let { _id, money } = users[i];
                if (money < minMoney) continue;
                allValidUsers.push({ _id, money });
            }
            for (let i = 0, length = allValidUsers.length; i < length; ++i) {
                updateMoneyRank(allValidUsers[i]);
            }
        })
        .catch(()=>{})
}

var updateMoneyRank = ({_id, money}) => {
    const MAX_LENGTH = 10;
    removeDuplicateEntry(_id);
    for (let i = 0; i < _topRankMoney.length; ++i) {
        if (money > _topRankMoney[i].money) {
            _topRankMoney.splice(i, 0, { id: _id, money });
            break;
        } else if (_topRankMoney.length < MAX_LENGTH && i === _topRankMoney.length - 1) {
            _topRankMoney.push({ id: _id, money });
            break;
        }
    }
    while (_topRankMoney.length > MAX_LENGTH) _topRankMoney.pop();
};

var removeDuplicateEntry = (id, index = 0) => {
    for (let i = index; i < _topRankMoney.length; ++i) {
        if (_topRankMoney[i].id === id) {
            _topRankMoney.splice(i, 1);
            return 1;
        }
    }
    return 0;
};
