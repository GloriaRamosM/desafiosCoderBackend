export function auth(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.redirect("/login");
  }
  next();
}

export function ensureIsAdmin(req, res, next) {
  console.log(req.session.user);
  if (req.session && req.session.user.rol == "Admin") {
    next();
    return;
  }
  res.status(401).json({ message: "User is not authorised" });
}

export function ensureIsUser(req, res, next) {
  if (req.session && req.session.user.rol == "User") {
    next();
    return;
  }
  res.status(401).json({ message: "User is not authorised" });
}
