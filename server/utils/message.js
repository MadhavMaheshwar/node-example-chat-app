
var moment = require('moment');

var generateMessage = (from, text) => {
    return {
        from,
        text,
        createdAt: moment().format('h:mm a')
    };
};


var generateLocationMessage = (from, lat, lng) => {
    return {
        from,
        url: `https://www.google.com/maps?q=${lat},${lng}`,
        createdAt: moment().format('h:mm a')
    };
};



module.exports = { generateMessage, generateLocationMessage }
