import axios from "axios";
import React, { useState, useEffect, useMemo } from "react";
import base from "../../config";
import Header from "../core/Header";
import Avatar from "../../assets/Avatar.png";
import { Modal, ModalTitle, ModalBody } from "react-bootstrap";
import { io } from "socket.io-client";

export default function Dashboard() {
  const socket = io("http://localhost:8080");

  socket.on("connect", () => {
    console.log("Welcome to WebSocket running on: http://localhost:8080");
  });

  const [user, setUser] = useState({});
  const [all, setAll] = useState([]);
  const [events, setEvents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [meetUps, setMeetUps] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [choice, setChoice] = useState("all");
  const [modal, setModal] = useState(false);
  const [eventId, setEventId] = useState("");
  const [registrations, setRegistrations] = useState({});

  socket.on("new-registration", (data) => {
    if (data.user._id !== user._id) {
      if (data.event.creator === user._id) {
        setRegistrations(data);
      }
    }
  });

  useEffect(async () => {
    if (!sessionStorage.getItem("token")) return window.location.assign("/");
    if (!sessionStorage.getItem("id")) return window.location.assign("/");

    const id = sessionStorage.getItem("id");

    axios.get(`${base}/user/${id}`).then((response) => {
      setUser(response.data);
    });

    let response = await axios.post(`${base}/api/user/events`, { id: id });

    setAll(response.data);
  }, []);

  useEffect(() => {
    console.log(registrations);
  }, [registrations]);

  useEffect(async () => {
    if (choice === "all") {
      let response = await axios.get(`${base}/dashboard`);

      if (response.data.error) {
        console.log(error);
      } else {
        setEvents(response.data);
        setMeetUps([]);
        setCourses([]);
        setMyEvents([]);
      }
    } else if (choice === "my") {
      let id = sessionStorage.getItem("id");

      let response = await axios.post(`${base}/api/user/events`, { id: id });

      if (response.data.error) {
        console.log(error);
      } else {
        setMyEvents(response.data);
        setEvents([]);
        setMeetUps([]);
        setCourses([]);
      }
    } else if (choice === "courses") {
      let response = await axios.get(`${base}/dashboard/Course`);

      if (response.data.error) {
        console.log(error);
      } else {
        setCourses(response.data);
        setEvents([]);
        setMeetUps([]);
        setMyEvents([]);
      }
    } else if (choice === "meetups") {
      let response = await axios.get(`${base}/dashboard/Meetup`);

      if (response.data.error) {
        console.log(error);
      } else {
        setMeetUps(response.data);
        setEvents([]);
        setCourses([]);
        setMyEvents([]);
      }
    }
  }, [choice]);

  const deleteHandle = async () => {
    let response = await axios.delete(`${base}/event/${eventId}`);

    if (response.data.error) {
      console.log(response.data.error);
    } else {
      window.location.reload();
    }
  };

  const registration = async (e, id) => {
    let newRegistration = {
      user: user._id,
      event: id,
      status: "Pending",
    };

    let response = await axios.post(`${base}/registration`, newRegistration);
    socket.emit("new", "new");

    if (response.data.error) {
      console.log(response.data.error);
    } else {
      socket.emit("added-registration", newRegistration);
    }
  };

  const approve = async () => {
    let res = await axios.post(
      `${base}/registration/${registrations._id}/approvals`
    );

    if (res.data.error) {
      return console.log(res.data.error);
    }

    setRegistrations(res.data);
  };

  const reject = async () => {
    let res = await axios.post(
      `${base}/registration/${registrations._id}/rejections`
    );

    if (res.data.error) {
      return console.log(res.data.error);
    }

    setRegistrations(res.data);
  };

  return (
    <>
      <Header />

      <div className="dashboard">
        <div className="dashboard-filter">
          <div className="dropdown">
            <button
              className="btn btn-primary dropdown-toggle"
              type="button"
              id="dropdownMenuButton"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Filter
            </button>
            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <a
                className="dropdown-item"
                onClick={() => setChoice("all")}
                style={{ cursor: "pointer" }}
              >
                All events
              </a>
              <a
                className="dropdown-item"
                onClick={() => setChoice("my")}
                style={{ cursor: "pointer" }}
              >
                My events
              </a>
              <a
                className="dropdown-item"
                onClick={() => setChoice("courses")}
                style={{ cursor: "pointer" }}
              >
                Courses
              </a>
              <a
                className="dropdown-item"
                onClick={() => setChoice("meetups")}
                style={{ cursor: "pointer" }}
              >
                Meetups
              </a>
            </div>
          </div>
        </div>

        <div className="reg-flex" style={{ marginBottom: "2rem" }}>
          <div className="reg-mapping">
            {registrations.status && (
              <div className="reg-single">
                <div className="reg-single-top">
                  <h4>{registrations.event.title}</h4>
                </div>

                <div className="reg-single-mid">
                  <h6>
                    Event Date: {registrations.event.date} Event Price:{" "}
                    {registrations.event.price}$ User email:{" "}
                    {registrations.user.email} Event Status:{" "}
                    {registrations.status === "Pending" && (
                      <span className="pending">{registrations.status}</span>
                    )}
                    {registrations.status === "Approved" && (
                      <span className="approved">{registrations.status}</span>
                    )}
                    {registrations.status === "Rejected" && (
                      <span className="rejected">{registrations.status}</span>
                    )}
                  </h6>
                </div>

                <div className="reg-single-bottom">
                  <button
                    type="button"
                    className="btn btn-secondary btn-lg btn-block"
                    disabled={registrations.status !== "Pending"}
                    onClick={approve}
                  >
                    Approve
                  </button>

                  <button
                    type="button"
                    className="btn btn-danger btn-lg btn-block"
                    disabled={registrations.status !== "Pending"}
                    onClick={reject}
                  >
                    Reject
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="dashboard-flex">
          <div className="dashboard-mapping">
            {events &&
              events.map((v, i) => {
                return (
                  <div className="single" key={i}>
                    {v.photo === "Avatar" ? (
                      <img src={Avatar} alt="avatar" />
                    ) : (
                      <img
                        src={base + "/uploads/" + v.photo}
                        alt={"evemt no" + i}
                      />
                    )}
                    <div className="single-info">
                      <h4>Event title: {v.title}</h4>
                      <p>Event description: {v.description}</p>
                      <p>Event price: {parseFloat(v.price).toFixed(2)}</p>
                      <p>Event category: {v.category}</p>
                    </div>
                    <div className="single-button">
                      {user._id === v.creator ? (
                        <div>
                          <button
                            type="button"
                            className="btn btn-danger btn-lg btn-block"
                            onClick={() => {
                              setModal(true);
                              setEventId(v._id);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      ) : (
                        <div>
                          <button
                            type="button"
                            className="btn btn-primary btn-lg btn-block"
                            onClick={(e) => registration(e, v._id)}
                          >
                            Register
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

            {myEvents &&
              myEvents.map((v, i) => {
                return (
                  <div className="single" key={i}>
                    {v.photo === "Avatar" ? (
                      <img src={Avatar} alt="avatar" />
                    ) : (
                      <img
                        src={base + "/uploads/" + v.photo}
                        alt={"evemt no" + i}
                      />
                    )}
                    <div className="single-info">
                      <h4>Event title: {v.title}</h4>
                      <p>Event description: {v.description}</p>
                      <p>Event price: {parseFloat(v.price).toFixed(2)}</p>
                      <p>Event category: {v.category}</p>
                    </div>
                    <div className="single-button">
                      {user._id === v.creator ? (
                        <div>
                          <button
                            type="button"
                            className="btn btn-danger btn-lg btn-block"
                            onClick={() => {
                              setModal(true);
                              setEventId(v._id);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      ) : (
                        <div>
                          <button
                            type="button"
                            className="btn btn-primary btn-lg btn-block"
                            onClick={(e) => registration(e, v._id)}
                          >
                            Register
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

            {courses &&
              courses.map((v, i) => {
                return (
                  <div className="single" key={i}>
                    {v.photo === "Avatar" ? (
                      <img src={Avatar} alt="avatar" />
                    ) : (
                      <img
                        src={base + "/uploads/" + v.photo}
                        alt={"evemt no" + i}
                      />
                    )}
                    <div className="single-info">
                      <h4>Event title: {v.title}</h4>
                      <p>Event description: {v.description}</p>
                      <p>Event price: {parseFloat(v.price).toFixed(2)}</p>
                      <p>Event category: {v.category}</p>
                    </div>
                    <div className="single-button">
                      {user._id === v.creator ? (
                        <div>
                          <button
                            type="button"
                            className="btn btn-danger btn-lg btn-block"
                            onClick={() => {
                              setModal(true);
                              setEventId(v._id);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      ) : (
                        <div>
                          <button
                            type="button"
                            className="btn btn-primary btn-lg btn-block"
                            onClick={(e) => registration(e, v._id)}
                          >
                            Register
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

            {meetUps &&
              meetUps.map((v, i) => {
                return (
                  <div className="single" key={i}>
                    {v.photo === "Avatar" ? (
                      <img src={Avatar} alt="avatar" />
                    ) : (
                      <img
                        src={base + "/uploads/" + v.photo}
                        alt={"evemt no" + i}
                      />
                    )}
                    <div className="single-info">
                      <h4>Event title: {v.title}</h4>
                      <p>Event description: {v.description}</p>
                      <p>Event price: {parseFloat(v.price).toFixed(2)}</p>
                      <p>Event category: {v.category}</p>
                    </div>
                    <div className="single-button">
                      {user._id === v.creator ? (
                        <div>
                          <button
                            type="button"
                            className="btn btn-danger btn-lg btn-block"
                            onClick={() => {
                              setModal(true);
                              setEventId(v._id);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      ) : (
                        <div>
                          <button
                            type="button"
                            className="btn btn-primary btn-lg btn-block"
                            onClick={(e) => registration(e, v._id)}
                          >
                            Register
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      <Modal show={modal}>
        <ModalTitle>
          <div className="modal-delete-title">
            <h2>Delete an Event</h2>
          </div>
        </ModalTitle>

        <ModalBody>
          <div className="modal-top">Are You Sure?</div>

          <div className="modal-bottom">
            <button
              type="button"
              className="btn btn-danger btn-lg btn-block"
              onClick={deleteHandle}
            >
              Yes
            </button>

            <button
              type="button"
              className="btn btn-primary btn-lg btn-block"
              onClick={() => setModal(false)}
            >
              No
            </button>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}
