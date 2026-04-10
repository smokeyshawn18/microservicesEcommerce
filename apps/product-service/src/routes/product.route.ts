import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../controller/product.controller.js";

const router: Router = Router();

router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.get("/:id", getProduct);
router.get("/", getProducts);

export default router;
