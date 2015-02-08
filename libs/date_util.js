var moment = require('moment');

var date_util = function (){};

date_util.toDateTimeString = function (timeStamp) {
    return toMoment(timeStamp).format('YYYY-MM-DD HH:mm:ss');
};

date_util.NowYMDDateString = function () {
    return moment().format('YYYYMMDD');
};


date_util.toDateString = function (timeStamp) {
    return toMoment(timeStamp).format('YYYY-MM-DD');
};

date_util.NowHmsTimeString = function () {
    return moment().format('YYYYMMDDHHmmss').substr(8,14);
};

date_util.toTimeString = function (timeStamp) {
    return toMoment(timeStamp).format('HH:mm:ss');
};

function toMoment(timeStamp) {
    return moment(timeStamp * 1000);
}

module.exports = date_util;