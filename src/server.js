import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import { localsMiddleware } from "./middlewares";

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({ extended: true }));

// session을 사용하기 위해서 선언
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    /*
    // cookie 유지 시간 설정: 밀리세컨드 단위로 1초 = 1000
    cookie: {
        maxAge: 20000,
    }
    */
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  })
);

// locals를 활용하기 위한 middleware를 만들어 사용
app.use(localsMiddleware);
app.use("/uploads", express.static("uploads"));
// app.use("/static", express.static("assets"));로 설정해도 됨, url에 접근할 때 /static으로 써주면 자동으로 assets폴더로 연결됨
app.use("/assets", express.static("assets"));
app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

export default app;
