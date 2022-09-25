export const localsMiddleware = (req, res, next) => {
  // session의 데이터를 locals에 넣어서 모든 template에서 활용할 수 있음
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "Wetube";
  // 로그인을 하지 않아 아직 세션이 만들어지지 않았을 때 에러를 없애기 위해서 || {} 를 추가하여 빈 객체 생성
  res.locals.loggedInUser = req.session.user || {};
  next();
};

export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    return next();
  } else {
    return res.redirect("/login");
  }
};

export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    return res.redirect("/");
  }
};
