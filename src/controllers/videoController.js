export const trending = (req, res) => res.send("Homepage Videos");
export const see = (req, res) => {
  res.send(`Watch Video #${req.params.id}`);
};
export const edit = (req, res) => {
  res.send(`Edit Video #${req.params.id}`);
};
export const deleteVideo = (req, res) => {
  res.send(`Delete Video #${req.params.id}`);
};
export const upload = (req, res) => res.send("Upload Video");
export const search = (req, res) => res.send("Search");
