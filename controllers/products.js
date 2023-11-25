const Product = require('../models/product');

const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields, numericFilter } = req.query;
  const queryObject = {};

  if (featured) queryObject.featured = featured === 'true';
  if (company) queryObject.company = company;
  if (name) queryObject.name = { $regex: name, $options: 'i' };
  if (numericFilter) {
    const operatorMap = {
      '>': '$gt',
      '<': '$lt',
      '=': '$eq',
      '<=': '$lte',
      '>=': '$gte',
    };
    const regEx = /\b(<|>|>=|=|<=)\b/g;
    let filters = numericFilter.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );
    const options = ['rating', 'price'];
    filters = filters.split(',').forEach((element) => {
      const [field, op, num] = element.split('-');
      if (options.includes(field)) queryObject[field] = { [op]: Number(num) };
      console.log(field, op, num);
    });
  }

  let productsQuery = Product.find(queryObject);
  if (sort) {
    productsQuery = productsQuery.sort(sort.split(',').join(' '));
  } else {
    productsQuery = productsQuery.sort('price');
  }

  if (fields) productsQuery.select(fields.split(',').join(' '));

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const skip = (page - 1) * limit;
  productsQuery.skip(skip).limit(limit);

  const products = await productsQuery;
  res.status(200).json({ count: products.length, products });
};

module.exports = { getAllProducts };
