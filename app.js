import express from "express";
import http from "http";
import dotenv from "dotenv";
import { connectDB } from "./db/connect.js";
import productsRouter from "./routes/products.js";
import { errorHandlerMiddleware } from "./middleware/error-handler.js";
import { notFound } from "./middleware/not-found.js";

dotenv.config();

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    const server = express();

    // Application-level middleware functions
    server.use(express.json());

    // Route-specific middleware functions
    server.get("/", (req, res) => {
      res.send(
        `<h1>Store API</h1><a href="/api/v1/products">products route </a>`
      );
    });

    server.use("/api/v1/products", productsRouter);

    // Error handling middleware functions
    server.use(errorHandlerMiddleware);

    // Not found middleware function
    server.use(notFound);

    const PORT = process.env.PORT || 8000;

    http.createServer(server).listen(PORT, function () {
      console.info("server is listening on:", this.address());
    });
  } catch (error) {
    console.log(error);
  }
};

start();
