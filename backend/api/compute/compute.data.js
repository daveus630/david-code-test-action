const config = require('../../constants/config.json');
const dateHelper = require('../../helpers/date.helper');

const CashIn = config.type.CashIn;
const CashOut = config.type.CashOut;
const Natural = config.userType.Natural;
const Juridical = config.userType.Juridical;

exports.computeData = (...args) => {
    let data = args[0];
    let ref = args[1];
    let result = (data.operation.amount * ref.percents) / 100;
    
    if(data.type === CashIn) {
        if (result > ref.max.amount) {
            result = ref.max.amount; 
        }
    }

    if(data.type === CashOut && data.user_type === Natural) {
        let nData = args[2];
        let prevData;
        
        if(nData.length != 0) {
            prevData = nData.filter(pdata => pdata.user_id == data.user_id)[nData.length - 1];
            if(prevData) {
                let pd = dateHelper.getDayIndex(prevData.date);
                let dd = dateHelper.getDayIndex(data.date);
                let diff = dateHelper.getDaysDiff(prevData.date, data.date);
                if(prevData.amountExceed) {
                    if (diff < 7 && Math.sign(dd - pd) != -1) { 
                        data.amountExceed = true;
                    }
                } else {
                    if (diff < 7 && Math.sign(dd - pd) != -1) { 
                        data.operation.amount += prevData.operation.amount;
                    }
                }
            }
        } 
        
        nData.push(data);

        if(data.operation.amount > ref.week_limit.amount) { 
            let sub = data.operation.amount - ref.week_limit.amount; 
            data.amountExceed = true;
            result = (sub * ref.percents) / 100;
        } else { 
            if(!data.amountExceed) {
                result = 0;
            }
        }
    } 
    if(data.type === CashOut && data.user_type === Juridical) {
        if(result < ref.min.amount) {
            result = ref.min.amount;
        }
    } 
    return parseFloat(result).toFixed(2);
}