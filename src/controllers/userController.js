export const join = (req, res) => res.send("Join User");
export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User");
export const login = (req, res) => res.send("Login");
export const see = (req, res) => {
  res.send(`See User #${req.params.id}`);
};
export const logout = (req, res) => res.send("logout");
