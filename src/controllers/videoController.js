import Video from "../models/Video";
import Comment from "../models/Comment";
import User from "../models/User";
import { async } from "regenerator-runtime";

export const home = async (req, res) => {
  try {
    const videos = await Video.find({})
      .sort({ createdAt: "desc" })
      .populate("owner");
    res.render("home", { pageTitle: "Home", videos });
  } catch {
    return res.status(400).render("server-error");
  }
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id).populate("owner").populate("comments");
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  } else {
    return res.render("watch", {
      pageTitle: video.title,
      video,
    });
  }
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  // exist로 확인하는 것이 아닌 findById를 사용해야만 함, res.render에서 video 오브젝트를 보내줘야 하기 때문임
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  // if는 타입까지도 비교함
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "Not authorized");
    return res.status(403).redirect("/");
  }
  res.render("Edit", { pageTitle: `Edit: ${video.title}`, video });
};

export const postEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const { title, description, hashtags } = req.body;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "You are not the owner of the video.");
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  req.flash("success", "Changes saved.");
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
  let modifiedVideoUrl = "";
  let modifiedThumbUrl = "";
  const {
    session: {
      user: { _id },
    },
    files: { video, thumb },
    body: { title, description, hashtags },
  } = req;
  const isHeroku = process.env.NODE_ENV === "production";
  console.log(video[0].location);
  console.log(thumb[0].location);
  /*
  const {
    user: { _id },
  } = req.session;
  const { path: fileUrl } = req.file;
  const { title, description, hashtags } = req.body;
  */
  // `https://${video[0].location.substr(20)}`
  modifiedVideoUrl = isHeroku ? `${video[0].location}` : `/${video[0].path}`;
  modifiedThumbUrl = isHeroku
    ? `https://${thumb[0].location.substr(20)}`
    : `/${thumb[0].path}`;
  try {
    const newVideo = await Video.create({
      title,
      description,
      fileUrl: modifiedVideoUrl,
      thumbUrl: modifiedThumbUrl,
      owner: _id,
      hashtags: Video.formatHashtags(hashtags),
    });
    const user = await User.findById(_id);
    // push 대신 unshift 사용: 최신 영상이 위에 보여지게 하기 위해서 배열의 맨 앞에 갚이 추가되도록 함
    user.videos.unshift(newVideo._id);
    user.save();
    return res.redirect("/");
  } catch (error) {
    return res.status(400).render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  const user = await User.findById(_id);
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndDelete(id);
  user.videos.splice(user.videos.indexOf(id), 1);
  user.save();
  return res.redirect("/");
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(`${keyword}`, "i"),
      },
    }).populate("owner");
  }
  return res.render("search", { pageTitle: "Search", videos });
};

export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    // status: render 등을 하기 전에 상태 코드만 정해 놓는 것
    // sendStatus: 상태 코드를 보내고 연결을 끝내는 것
    return res.sendStatus(404);
  }
  video.meta.views = video.meta.views + 1;
  await video.save();
  return res.sendStatus(200);
};

export const createComment = async (req, res) => {
  const {
    // 쿠키를 통해서 세션 받음, 바디는 json으로, id는 url 파라미터로 받음
    session: { user },
    body: { text },
    params: { id },
  } = req;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }

  const userDB = await User.findById(user._id);
  if (!userDB) {
    return res.sendStatus(404);
  }
  const comment = await Comment.create({
    text,
    owner: user._id,
    video: id,
  });
  video.comments.push(comment._id);
  video.save();
  // user는 세션이므로 재로그인 전에는 갱신 안됨, 갱신을 원하면 수동으로 해줘야 험.
  userDB.comments.push(comment._id);
  userDB.save();
  // 세션 업데이트
  user.comments.push(comment._id);
  return res.status(201).json({ newCommentId: comment._id });
};

export const deleteComment = async (req, res) => {
  const {
    session: {
      user: { _id: userId },
    },
    params: { id: commentId },
  } = req;
  const comment = await Comment.findById(commentId);
  //console.log(comment);
  if (String(userId) !== String(comment.owner._id)) {
    return res.sendStatus(403);
  }
  const videoId = comment.video;
  const video = await Video.findById(videoId);
  if (!video) {
    return res.sendStatus(404);
  }

  video.comments.splice(video.comments.indexOf(commentId), 1);
  video.save();
  const user = await User.findById(userId);
  if (!user) {
    return res.sendStatus(404);
  }
  user.comments.splice(user.comments.indexOf(commentId), 1);
  user.save();

  await Comment.findByIdAndDelete(commentId);
  return res.sendStatus(200);
};
