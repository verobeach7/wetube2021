import express from "express";
import morgan from "morgan";
import session from "express-session";
import flash from "express-flash";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import { localsMiddleware } from "./middlewares";
import apiRouter from "./routers/apiRouter";

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
// SharedArrayBuffer is not defined 오류 해결 방법

app.use((req, res, next) => {
  res.header("Cross-Origin-Embedder-Policy", "require-corp");
  res.header("Cross-Origin-Opener-Policy", "same-origin");
  next();
});

/*
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
*/

app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// session을 사용하기 위해서 선언
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
    /*
    // cookie 유지 시간 설정: 밀리세컨드 단위로 1초 = 1000
    cookie: {
        maxAge: 20000,
    }
    */
  })
);
app.use(flash());
// locals를 활용하기 위한 middleware를 만들어 사용
app.use(localsMiddleware);
app.use("/uploads", express.static("uploads"));
// app.use("/static", express.static("assets"));로 설정해도 됨, url에 접근할 때 /static으로 써주면 자동으로 assets폴더로 연결됨
app.use("/assets", express.static("assets"));
app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);
app.use("/api", apiRouter);

export default app;
