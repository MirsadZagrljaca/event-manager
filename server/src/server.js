import config from "./config/config";
import app from "./express";

app.listen(config.port, (err) => {
  if (err) {
    console.log(err);
  }

  console.info("Server started on port", config.port);
});

import mongoose from "mongoose";

const mongoUrl = `mongodb+srv://${config.mongoUser}:${config.mongoPass}${config.mongoCluster}/${config.database}?retryWrites=true&w=majority`;

mongoose.Promise = global.Promise;
mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully..."))
  .catch(() => console.log(`Error connecting to MongoDB ${mongoUrl}`));

const io = require("socket.io")(8080, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});
import Registration from "./models/registration.model";

io.on("connection", (socket) => {
  console.log(socket.id);

  socket.on("added-registration", (newReg) => {
    Registration.find()
      .populate("event")
      .populate("user")
      .exec((err, registrations) => {
        if (err) {
          return console.log(err);
        }
        io.emit("new-registration", registrations[registrations.length - 1]);
      });
  });
});
