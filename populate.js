import dotenv from "dotenv";
import { connectDB } from "./db/connect.js";
import Product from "./models/product.js";
import products from "./products.json" assert { type: "json" };

dotenv.config();

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    await Product.deleteMany();
    await Product.create(products);

    console.log("Success");
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
