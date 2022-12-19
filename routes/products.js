import { Router } from "express";
import {
  getAllProducts,
  getAllProductsStatic,
  getProduct,
} from "../controllers/products.js";

export const router = Router();

router.route("/").get(getAllProducts);
router.route("/:id").get(getProduct);
router.get("/static", getAllProductsStatic);

export default router;
