export const localsMiddleware = (req, res, next) => {
  console.log(req.session);
  // session의 데이터를 locals에 넣어서 모든 template에서 활용할 수 있음
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "Wetube";
  res.locals.loggedInUser = req.session.user;
  console.log(res.locals);
  next();
};
