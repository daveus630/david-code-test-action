const expect = require('chai').expect;
const { computeData } = require('../api/compute/compute.data');

const confCashin = {
    percents: 0.03,
    max: {
        amount: 5,
        currency: "EUR"
    }
}
const coNatural = {
    percents: 0.3,
    week_limit: {
        amount: 1000,
        currency: "EUR"
    }
}
const coJuridical = {
    percents: 0.3,
    min: {
        amount: 0.5,
        currency: "EUR"
    }
}

describe('#App - compute.data.js', () => {
    describe('Commission fees calculation with "cash_in" type.', () => {
        let d1 = {
            type: 'cash_in',
            operation: {
                amount: 10000
            }
        }
        it('should return default computation with (operation.amount * 0.03) if result is not greater than 5 (max).', () => {
            let max = confCashin.max.amount;
            let result = parseInt(computeData(d1, confCashin));
            expect(result).to.lessThan(max);
        })
        it('should return 5 (max) if calculated result is greater than max amount.' , () => { 
            d1.operation.amount = 1000000
            let max = parseFloat(confCashin.max.amount).toFixed(2);
            let result = parseFloat(computeData(d1, confCashin)).toFixed(2);
            expect(result).to.equal(max);
        })
    })
    describe('Commission fees calculation with "cash_out" type.', () => {
        describe('For Natural persons', () => {
            let nData = [];
            let data = {
                date: "2016-01-06",
                user_id: 1,
                user_type: "natural",
                type: "cash_out",
                operation: {
                    amount: 500,
                    currency: "EUR"
                }
            }
            it('should return 0 commission if total operation.amount for the week (mon-sun) is less than week_limit amount (1000).', (done) => {
                let result = parseInt(computeData(data, coNatural, nData));
                expect(result).to.equal(0);
                nData.length = 0;
                done();
            })
            it('should return commision calculated from ((op.amount-1000) * pct) if op.amount exceeds week_limit (1000).', (done) => {
                data.operation.amount = 30000;
                let commission = ((data.operation.amount - coNatural.week_limit.amount) * coNatural.percents) / 100;
                let result = parseFloat(computeData(data, coNatural, nData)).toFixed(2);
                expect(result).to.equal(parseFloat(commission).toFixed(2));
                nData.length = 0;
                done();
            });
            it('should return 0 commission if sum of op.amount of all entries from the same user in the same week is less than week_limit amount (1000)', (done) => {
                let prevData = {
                    date: "2020-01-01",
                    user_id: 1,
                    user_type: "natural",
                    type: "cash_out",
                    operation: {
                        amount: 500,
                        currency: "EUR"
                    }
                }
                nData.push(prevData);
                let newData = {
                    date: "2020-01-03",
                    user_id: 1,
                    user_type: "natural",
                    type: "cash_out",
                    operation: {
                        amount: 200,
                        currency: "EUR"
                    }
                }
                
                let result = parseInt(computeData(newData, coNatural, nData));
                expect(result).to.equal(0);
                nData.length = 0;
                done();
            })
            it('should return the calculated commission based on the excess in week_limit after adding amount entries from the same user in the same week.', (done) => {
                let prevData = {
                    date: "2020-01-01",
                    user_id: 1,
                    user_type: "natural",
                    type: "cash_out",
                    operation: {
                        amount: 500,
                        currency: "EUR"
                    }
                }
                nData.push(prevData);
                let newData = {
                    date: "2020-01-03",
                    user_id: 1,
                    user_type: "natural",
                    type: "cash_out",
                    operation: {
                        amount: 600,
                        currency: "EUR"
                    }
                }
                let commission = (((newData.operation.amount+prevData .operation.amount)- coNatural.week_limit.amount) * coNatural.percents) / 100;
                let result = parseFloat(computeData(newData, coNatural, nData)).toFixed(2);
                expect(result).to.equal(parseFloat(commission).toFixed(2));
                nData.length = 0;
                done();
            })
        }),
        describe('For Legal or Juridical persons', () => {
            let d = {
                type: 'cash_out',
                user_type: 'juridical',
                operation: {
                    amount: 300
                }
            }
            it('should return default computation with (operation.amount * 0.3) if result is not less than min.amount.', (done) => {
                let min = coJuridical.min.amount;
                let result = parseFloat(computeData(d, coJuridical)); 
                expect(result).to.greaterThan(min);
                done();
            });
            it('should return 0.5 (min) if calculated result is less than min amount.', () => {
                d.operation.amount = 100;
                let min = coJuridical.min.amount;
                let result = parseFloat(computeData(d, coJuridical)); 
                expect(result).to.equal(min);
            });
        });
    });
});

