import "regenerator-runtime";
import "dotenv/config";
import "./db";
import "./models/Video";
import "./models/User";
import "./models/Comment";
import app from "./server";

// 내 컴퓨터에서 사용할 때는 4000을 사용, Heroku에서 사용할 때는 Heroku에서 주는 process.env.PORT 사용
const PORT = process.env.PORT || 4000;

const handleListening = () =>
  console.log(`✅ Server listening on Port http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);
