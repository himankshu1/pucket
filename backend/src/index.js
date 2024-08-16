import express from "express";
import dotenv from "dotenv";
import connectToDB from "./utils/connectToDB.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config({
  path: "./.env",
});

const app = express();
const PORT = process.env.PORT || 7000;

app.use(cookieParser());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

//* database connectivity
await connectToDB();

//* import routes
import userRouter from "./routes/user.routes.js";
import imageRouter from "./routes/image.routes.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/images", imageRouter);

app.listen(PORT, () => {
  console.log(`server is listening at ${PORT}`);
});
