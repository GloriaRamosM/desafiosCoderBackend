import { ProductsService } from "../repositories/index.js";

export function auth(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.redirect("/login");
  }
  next();
}

export function ensureIsAdmin(req, res, next) {
  req.logger.debug(req.session.user);
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

export function ensureNotUser(req, res, next) {
  if (req.session && req.session.user.rol != "User") {
    next();
    return;
  }
  res.status(401).json({ message: "User is not authorised" });
}

export async function ensureHasAccessToProduct(req, res, next) {
  if (req.session && req.session.user.rol == "Premium") {
    const productId = req.params.pid;
    let product = await ProductsService.getById(productId);

    if (product.owner == req.session.user._id) {
      next();
      return;
    }
  }

  if (req.session && req.session.user.rol == "Admin") {
    next();
    return;
  }

  res.status(401).json({ message: "User is not authorised" });
}
