const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/product.js');
const orderRoutes = require('./api/routes/orders.js');

mongoose.connect("mongodb+srv://arjun:" +
 //process.env.MONGO_ATLAS_PW
    "arjun" +
  "@cluster0.ihx2t.mongodb.net/<dbname>?retryWrites=true&w=majority",{
    useNewUrlParser: true,
    useUnifiedTopology: true
    //useMongoClient: true
});





app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-with, Content-Type, Accept, Authorization"
    );
    if( req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({});
    }
    next();
});

//Routes
app.use('/product',productRoutes);
app.use('/orders',orderRoutes);

app.use((req,res,next)=>{
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})


app.use((error,req,res,next)=>{
    res.status(error.status||500);
    res.json({
        error: {
            message: error.message
        }
    });
});


module.exports = app;