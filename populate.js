require('dotenv').config();
const connectDB = require('./db/connect');
const productsModel = require('./models/product');

const products = require('./products.json');

const populate = async (req, res) => {
  try {
    await connectDB(process.env.DATABASE_URL);
    await productsModel.deleteMany();
    await productsModel.insertMany(products);
    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

populate();
