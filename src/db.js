import mongoose from "mongoose";

// Heroku DB_URL은 Heroku 사이트에 환경변수로 따로 저장해 놓음
// 여기에서는 개발 중에 사용할 DB_URL을 .env 파일에 저장해 놓음(localhost:4000에서 사용)
mongoose.connect(process.env.DB_URL);

const db = mongoose.connection;

const handleOpen = () => console.log("✅ Connected to DB");
const handleError = (error) => console.log("❌ DB Error", error);

db.on("error", handleError);
db.once("open", handleOpen);
