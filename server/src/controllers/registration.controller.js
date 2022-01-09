import Registration from "../models/registration.model";
import _ from "lodash";
import dbErrorHandler from "../helpers/dbErrorHandler";

const registrationById = (req, res, next, id) => {
  Registration.findById(id)
    .populate("event")
    .populate("user")
    .exec((err, registration) => {
      if (err || !registration) {
        return res.status(400).json({ error: "Registration not found" });
      }

      req.profile = registration;
      next();
    });
};

const create = (req, res, next) => {
  let registration = new Registration(req.body);

  registration.save((err, result) => {
    if (err) {
      return res.json({ error: dbErrorHandler.getErrorMessage(err) });
    }

    res.status(200).json({ message: "Successfully registrated!" });
  });
};

const list = (req, res) => {
  Registration.find()
    .populate("event")
    .populate("user")
    .exec((err, registrations) => {
      if (err) {
        return res.json({ error: dbErrorHandler.getErrorMessage(err) });
      }

      res.status(200).json(registrations);
    });
};

const read = (req, res, next) => {
  res.status(200).json(req.profile);
};

const approve = (req, res) => {
  let data = {
    status: "Approved",
  };

  let registration = req.profile;

  registration = _.extend(registration, data);

  registration.save((err) => {
    if (err) {
      return res
        .status(400)
        .json({ error: dbErrorHandler.getErrorMessage(err) });
    }

    res.status(200).json(registration);
  });
};

const reject = (req, res) => {
  let data = {
    status: "Rejected",
  };

  let registration = req.profile;

  registration = _.extend(registration, data);

  registration.save((err) => {
    if (err) {
      return res
        .status(400)
        .json({ error: dbErrorHandler.getErrorMessage(err) });
    }

    res.status(200).json(registration);
  });
};

export default { registrationById, create, list, read, approve, reject };
