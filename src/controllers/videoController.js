import Video from "../models/Video";

/* Callbakc Function
export const home = (req, res) => {
  console.log("First");
  Video.find({}, (error, videos) => {
    if(error) {
      return res.render("server-error")
    }
    console.log("Second");
    res.render("home", { pageTitle: "Home", videos: [] });
    return console.log("Third");
  });
  console.log("Fourth");
};
*/

/* Promise(async and await) */
export const home = async (req, res) => {
  try {
    console.log("First");
    const videos = await Video.find({});
    console.log("Second");
    console.log(videos);
    res.render("home", { pageTitle: "Home", videos });
    return console.log("Third");
  } catch {
    return res.render("server-error");
  }
};

export const watch = (req, res) => {
  const { id } = req.params;
  return res.render("watch", {
    pageTitle: `Watching`,
  });
};
export const getEdit = (req, res) => {
  const { id } = req.params;
  res.render("Edit", { pageTitle: `Editing` });
};
export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  return res.redirect(`/videos/${id}`);
};
export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};
export const postUpload = (req, res) => {
  const { title } = req.body;

  return res.redirect("/");
};
