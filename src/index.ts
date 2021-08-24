import express, { Application } from "express";
import { userRouter } from "./routes/user.routes";
const app: Application = express();

app.use(userRouter);

app.listen(5000, () => console.log("Server has started!"));
