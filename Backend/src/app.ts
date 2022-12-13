import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import config from "./2-utils/config";
import catchAll from "./3-middleware/catch-all";
import { RouteNotFoundError } from "./4-models/error-models";
import controller from "./6-controllers/controllers";
import dal from "./2-utils/dal";
import authController from "./6-controllers/auth-controller";
import path from "path";

const server = express();

server.use(cors());

// Tell express to extract json object from request body into request.body variable:
server.use(express.json());
server.use(express.urlencoded({ extended: false }));

// Transfer requests to the controller:
server.use("/api", controller);
server.use("/api", authController);
server.use("/images", express.static(path.join(__dirname, "1-assets/images")));

server.use("*", (request: Request, response: Response, next: NextFunction) => {
  next(new RouteNotFoundError(request.method, request.originalUrl));
});

server.use(catchAll);

server.listen(config.port, () => {
  dal.connect();
  console.log(`Listening on http://localhost:${config.port}`);
});
