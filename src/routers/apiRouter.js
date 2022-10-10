import express from "express";
import {
  createComment,
  deleteComment,
  registerView,
} from "../controllers/videoController";

const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9,a-f]{24})/view", registerView);
apiRouter.post("/videos/:id([0-9,a-f]{24})/comment", createComment);
apiRouter.delete("/comment/:id([0-9,a-f]{24})", deleteComment);

export default apiRouter;
