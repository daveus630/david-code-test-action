const dateformat = require('dateformat');
const moment = require('moment');

exports.getDaysDiff = (startDate, endDate) => {
    let prevDate = new Date(dateformat(startDate, "default"));
    let lastDate = new Date(dateformat(endDate, "default"));

    let start_date = moment(prevDate, 'YYYY-MM-DD HH:mm:ss');
    let end_date = moment(lastDate, 'YYYY-MM-DD HH:mm:ss');
    let duration = moment.duration(end_date.diff(start_date));
    let days = duration.asDays();       
    return days;
}

exports.getDayIndex = (dDate) => {
    return new Date(dateformat(dDate, "default")).getDay() || 7;
}
