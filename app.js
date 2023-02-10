const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 8400;

mongoose.connect('mongodb://127.0.0.1:27017/first', {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
    console.log('Database connected');
}).catch((err) => {
    console.log(err);
});

app.use(bodyParser.urlencoded({extends: false}));
app.use(bodyParser.json());


const producScema = new mongoose.Schema({
    id: String,
    name: String,
    company: String,
    price: Number,
    color: String,
    image: String,
    description: String,
    category: String,
    featured: Boolean,
    stock: Number,
    reviews: Number,
    stars: Number,
});

const Product = mongoose.model('Product', producScema);


app.post('/products', async (req, res) => {
 const product = await Product.create(req.body);

   res.status(201).json({success: true, product});
});

app.get('/product', async (req, res) => {
    const products = await Product.find();

    res.status(200).json({success: true, products});

});

app.put('/products/:id', async (req, res) => {
    let product = await Product.findById(req.params.id);


    if(!product)
    {
        return res.status(500).json({success: false, message: "Product not found"
    });
    }


    product = await Product.findByIdAndUpdate(req.params.id,req.body, {new: true,usebFindAndModify: false,runValidators: true});

    res.json({success: true, product});
});

app.delete('/products/:id', async (req, res) => {

    
    const product = await Product.findById(req.params.id);
    
    if(!product)
    {
        return res.status(500).json({success: false, message: "Product not found"
    });
    }

    await Product.remove();

    res.json({success: true, message:"Product deleted successfully"});
});

app.listen(port, () => {
    console.log('Server is running on port 8400');
});