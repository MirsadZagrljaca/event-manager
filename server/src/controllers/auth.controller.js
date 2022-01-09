import User from "../models/user.model";

import jwt from "jsonwebtoken";
import config from "./../config/config";

import cache from "../../../cache/cache";

const login = (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: "User not found" });
    }

    if (!user.authenticate(req.body.password)) {
      return res.status(401).send({ error: "Email and password don't match" });
    }

    const token = jwt.sign({ _id: user._id }, config.jwtSecret);

    res.cookie("t", token, { expire: new Date() + 9999 });

    cache._id = user._id;
    cache.firstName = user.firstName;
    cache.lastName = user.lastName;
    cache.email = user.email;

    return res.status(200).json({
      token: token,
      cache: cache,
    });
  });
};

export default { login };
