import express from "express";
import cors from "cors";
import morgan from "morgan";
// Import everything from the Bridge
import { loadExpressKit, ExpressKitError } from "./config/expresskit.bridge";

const app = express();

// Allow any origin so external evaluators can hit our API
app.use(cors({ origin: "*", methods: ["GET", "POST", "OPTIONS"] }));
app.use(express.json());
app.use(morgan("dev"));

loadExpressKit(app);


app.use(ExpressKitError);

export default app;
