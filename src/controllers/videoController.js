const fakeUser = {
  username: "verobeach",
  loggedIn: true,
  //loggedIn: false,
};

export const trending = (req, res) => {
  //const videos = [];
  const videos = [1, 2, 3, 4, 5, 6, 7, 8];
  res.render("home", { pageTitle: "Home", fakeUser, videos });
};
export const see = (req, res) => res.render("watch", { pageTitle: "Watch" });
export const edit = (req, res) => res.render("edit", { pageTitle: "Edit" });
export const deleteVideo = (req, res) => {
  res.send(`Delete Video #${req.params.id}`);
};
export const upload = (req, res) => res.send("Upload Video");
export const search = (req, res) => res.send("Search");
