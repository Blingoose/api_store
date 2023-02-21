import { asyncWrapper } from "../middleware/async.js";
import { createCustomError } from "../errors/custom-errors.js";
import Product from "../models/product.js";

//* for testing purpose only
export const getAllProductsStatic = asyncWrapper(async (req, res, next) => {
  res.status(200).json({ msg: "products testing route" });
});

export const getAllProducts = asyncWrapper(async (req, res, next) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query;
  let queryObject = {};

  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }
  if (company) {
    queryObject.company = company;
  }

  if (name) {
    queryObject.name = { $regex: `^(${name})`, $options: "i" };
  }

  if (numericFilters) {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    };

    const regEx = /\b(<|<=|=|>=|>)\b/g;

    let filters = numericFilters.split(",").reduce((acc, element) => {
      const [field, operator, value] = element.split(regEx);
      if (["price", "rating"].includes(field)) {
        acc[field] = { [operatorMap[operator]]: Number(value) };
      }
      return acc;
    }, {});

    Object.assign(queryObject, filters);
  }

  let result = Product.find(queryObject);

  if (sort) {
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  } else {
    result = result.sort("price");
  }

  if (fields) {
    const fieldsList = fields.split(",").join(" ");
    result = result.select(fieldsList);
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const products = await result;
  res.status(200).json({ products, nbHits: products.length });
});

export const getProduct = asyncWrapper(async (req, res, next) => {
  const { id: productID } = req.params;
  const product = await Product.findOne({ _id: productID });
  if (!product) {
    return next(createCustomError(`No product with id of ${productID}`, 404));
  }
  res.status(200).json({ product });
});
