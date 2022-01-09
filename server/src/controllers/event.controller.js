import Event from "../models/event.model";
import _ from "lodash";
import dbErrorHandler from "../helpers/dbErrorHandler";
import cache from "../../../cache/cache";

const eventById = (req, res, next, id) => {
  Event.findById(id)
    .populate("creator")
    .exec((err, event) => {
      if (err || !event) {
        return res.status(400).json({ error: "Event not found" });
      }

      req.profile = event;
      next();
    });
};

const create = (req, res, next) => {
  let event = {};

  if (req.file) {
    event = new Event({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      date: req.body.date,
      photo: req.file.filename,
      category: req.body.category,
      creator: req.body.creator,
    });
  } else {
    event = new Event({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      date: req.body.date,
      photo: "Avatar",
      category: req.body.category,
      creator: req.body.creator,
    });
  }

  delete event.img;
  event.save((err, result) => {
    if (err) {
      return res.json({ error: dbErrorHandler.getErrorMessage(err) });
    }

    res.status(200).json({ message: "Successfully added Event" });
  });
};

const list = (req, res) => {
  Event.find((err, events) => {
    if (err) {
      return res
        .status(400)
        .json({ error: dbErrorHandler.getErrorMessage(err) });
    }

    res.status(200).json(events);
  });
};

const read = (req, res, next) => {
  res.status(200).json(req.profile);
};

const remove = (req, res, next) => {
  let event = req.profile;
  event.remove((err, deletedEvent) => {
    if (err) {
      return res
        .status(400)
        .json({ error: dbErrorHandler.getErrorMessage(err) });
    }
    res.status(200).json(deletedEvent);
  });
};

const update = (req, res, next) => {
  let event = req.profile;
  let data = req.body;

  if (req.file) {
    event.photo = req.file.filename;
    delete data.img;
  }

  event = _.extend(employee, data);

  event.save((err) => {
    if (err) {
      return res
        .status(400)
        .json({ error: dbErrorHandler.getErrorMessage(err) });
    }

    res.status(200).json(event);
  });
};

const eventByUser = (req, res) => {
  let id = req.body.id;

  Event.find({ creator: id }).exec((err, events) => {
    if (err || !events) {
      return res.json({ error: "Events not found!" });
    }

    res.json(events);
  });
};

const eventByCategory = (req, res, next, category) => {
  Event.find({ category: category })
    .populate("creator")
    .exec((err, events) => {
      if (err || !events) {
        return res.status(400).json({ error: "Event not found" });
      }

      req.profile = events;
      next();
    });
};

const getEventsByCategory = (req, res) => {
  res.status(200).json(req.profile);
};

export default {
  create,
  list,
  eventById,
  read,
  update,
  remove,
  eventByUser,
  eventByCategory,
  getEventsByCategory,
};
