const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const paymentRoute = require('./api/routes/payment.route');

const app = express();

const port = process.env.PORT || 4000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    next();
});


app.use('/api', paymentRoute);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    const file = process.argv[process.argv.length - 1];
    if (file.split('.')[1] === 'json' || file.split('.')[1] === 'txt') {
        require('./api/compute')(file)
    }
})