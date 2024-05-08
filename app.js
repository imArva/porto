require('dotenv').config();
const express = require('express');
const app = express();

const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const favicon = require('serve-favicon');
const path = require('path');
const cors = require('cors');
const hcaptcha = require('express-hcaptcha');

const SECRET = process.env.HCAPTCHA_SECRET;

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(cors());
app.use(express.static('./public'));
app.use(express.urlencoded({extended: true}));
app.use(expressLayouts);
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGOOSE_URI);
    } catch (error) {
        console.log(error);
    }
};
connect();

const product = require('./models/products');

app.get('/', async (req, res) => {

    const products = await product.find();

    res.render('index', {
        layout: 'layouts/user',
        title: 'Hello!',
        sitekey: process.env.HCAPTCHA_SITEKEY,
        products
    });

});

app.post('/add-product', hcaptcha.middleware.validate(SECRET) ,async (req, res) => {
    if (req.hcaptcha.success) {

        const count = await product.countDocuments({});

        if (count >= 5) {
            await product.findOneAndDelete(null)
            .catch(error => {
                res.send(`error: ${error}`);
            });
        }

        await product.insertMany(req.body);
    }
    
    res.redirect('/#what-i-do');
});

app.put('/edit', hcaptcha.middleware.validate(SECRET) , async (req, res) => {
    if (req.hcaptcha.success) {
        await product.updateOne({
            $where: {
                _id: req.body._id
            },
            $set: {
                name: req.body.name,
                price: req.body.price,
            }
        });
    }

    res.redirect('/#what-i-do');
});

app.delete('/delete', async (req, res) => {
    await product.deleteOne({
        _id: req.body._id
    });

    res.redirect('/#what-i-do');
});

app.get('/thank-you', (req, res) => {
    res.render('thank-you', {
        layout: 'layouts/user',
        title: 'Thank You!',
    });
});

app.get('/voter', (req, res) => {
    res.render('voter', {
        layout: 'layouts/user',
        title: 'My Work - Voter',
    });
});

app.get('/library', (req, res) => {
    res.render('library', {
        layout: 'layouts/user',
        title: 'My Work - Library',
    });
});

app.listen(process.env.APP_PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.APP_PORT}/`);
});

process.on('exit', async () => {
    await mongoose.disconnect();
});