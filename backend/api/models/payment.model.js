const fs = require('fs');
const path = require('path');
const dateformat = require('dateformat');
const config = require('../../constants/config.json');

const file = process.argv[process.argv.length - 1];

module.exports = class Payment {
    payment = {};
    constructor(paymentObj) {
        this.payment.date = dateformat(paymentObj.date, "isoDate") || dateformat(new Date(), "isoDate");
        this.payment.user_id = parseInt(paymentObj.user_id);
        this.payment.user_type = paymentObj.user_type;
        this.payment.type = paymentObj.type;
        this.payment.operation = {},
        this.payment.operation.amount = parseInt(paymentObj.amount);
        this.payment.operation.currency = paymentObj.currency;
    }

    save() {
        const p = path.join(
            path.dirname(process.mainModule.filename), 
            config.dataFolder, 
            file
        );
        fs.readFile(p, (err, fileContent) => {
            let payments = [];
            if(!err) {
                payments = JSON.parse(fileContent);
            }
            payments.push(this.payment);
            fs.writeFile(p, JSON.stringify(payments), (err) => {
                if(err => console.log(err));                
            })
        })
    }

    static getAllPayments() {
        const p = path.join(
            path.dirname(process.mainModule.filename), 
            config.dataFolder, 
            file
        );
        
        if(fs.existsSync(p)) {
            const fileContent = fs.readFileSync(p, 'utf8');
            return JSON.parse(fileContent);
        }
        
        let err = new Error(`File ${p} does not exist...`);
        return err;
    }
}