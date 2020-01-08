const fs = require('fs');
const path = require('path');
const config = require('../../constants/config.json');
const { callAsync } = require('../../helpers/async.helper');
const { computeData } = require('./compute.data');

const CashIn = config.type.CashIn;
const CashOut = config.type.CashOut;
const Natural = config.userType.Natural;
// const Juridical = config.userType.Juridical;

module.exports = (file) => {
    getData(file);
}

const getData = (file) => {
    const p = path.join(
        path.dirname(process.mainModule.filename), 
        config.dataFolder, 
        file
    );
    
    if(fs.existsSync(p)) {
        const fileData = JSON.parse(fs.readFileSync(p, 'utf8'));
        assessData(fileData);
    }
}

const assessData = async (fileData) => {
    let cashIn, coNatural, coLegal, naturalData = [];
    
    cashIn = await callAsync(config.cashInURL);
    coNatural = await callAsync(config.cashOutURL.natural);
    coLegal = await callAsync(config.cashOutURL.legal);
    
    for (let data of fileData) {   
        if(data.type == CashIn) { 
            let result = computeData(data, cashIn);
            console.log(result);
        } else if(data.type == CashOut && data.user_type == Natural) {
            if(data.operation.amount > coNatural.week_limit.amount) {
                data.amountExceed = true;
            }
            let result = computeData(data, coNatural, naturalData);
            console.log(result);
        } else {
            let result = computeData(data, coLegal);
            console.log(result);
         }
    }  
}


