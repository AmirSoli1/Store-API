require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();

const notFoundMiddleWare = require('./middleware/not-found');
const errorHandlerMiddleWare = require('./middleware/error-handler');

const connectDB = require('./db/connect');

app.use(express.json());

const productsRouter = require('./routes/products');
app.use('/api/v1/products', productsRouter);

app.get('/', (req, res) => {
  res.send('<h1>Store API</h1><a href="/api/v1/products">products route</a>');
});

app.use(notFoundMiddleWare);
app.use(errorHandlerMiddleWare);

const port = process.env.port || 3000;

const start = async () => {
  try {
    await connectDB(process.env.DATABASE_URL);
    app.listen(port, () => console.log(`Server is listening port ${port}...`));
  } catch (err) {
    console.log(err);
  }
};

start();
