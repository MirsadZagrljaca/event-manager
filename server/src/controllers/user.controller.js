import User from "../models/user.model";
import dbErrorHandler from "../helpers/dbErrorHandler";

const list = (req, res) => {
  User.find((err, users) => {
    if (err) {
      return res.status(400).json({
        error: dbErrorHandler.getErrorMessage(err),
      });
    }
    res.json(users);
  }).select("_id firstName lastName email");
};

const userByID = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      res.json({ error: "User not found!" });
    }

    req.profile = user;
    next();
  });
};

const read = (req, res) => {
  res.json(req.profile);
};

const create = (req, res) => {
  const user = new User(req.body);

  user.save((err, result) => {
    if (err) {
      return res.json({ error: dbErrorHandler.getErrorMessage(err) });
    }

    res.json({ message: "Created User!" });
  });
};

export default { userByID, create, read, list };
