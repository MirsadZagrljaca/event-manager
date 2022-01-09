import axios from "axios";
import React, { useState, useEffect } from "react";
import { Alert, Button } from "react-bootstrap";
import base from "../../config";
import Header from "../core/Header";
import Avatar from "../../assets/Avatar.png";

export default function CreateEvent() {
  const [user, setUser] = useState({});
  const [values, setValues] = useState({
    title: "",
    description: "",
    price: 0.0,
    date: "",
    category: "",
    error: "",
    redirect: false,
  });
  const [img, setImg] = useState({});
  const [file, setFile] = useState(Avatar);

  useEffect(async () => {
    if (!sessionStorage.getItem("id")) return window.location.assign("/");
    if (!sessionStorage.getItem("token")) return window.location.assign("/");

    let id = sessionStorage.getItem("id");

    axios.get(`${base}/user/${id}`).then((response) => {
      setUser(response.data);
    });
  }, []);

  const submitHandle = async () => {
    let newEvent = new FormData();

    if (values.category !== "Course" && values.category !== "Meetup") {
      return setValues({ ...values, error: "Choose a valid category" });
    }

    img && newEvent.append("img", img);
    values.title && newEvent.append("title", values.title);
    values.description && newEvent.append("description", values.description);
    values.price && newEvent.append("price", values.price);
    values.date && newEvent.append("date", values.date);
    values.category && newEvent.append("category", values.category);
    user._id && newEvent.append("creator", user._id);

    let response = await axios.post(`${base}/event`, newEvent);

    if (response.data.error) {
      setValues({ ...values, error: response.data.error });
    } else {
      setValues({ ...values, error: "", redirect: true });
    }
  };

  if (values.redirect) {
    return window.location.assign("/dashboard");
  }

  return (
    <>
      <Header />

      <div className="login" style={{ marginTop: "2rem" }}>
        <div>
          <div className="login-header">
            <h2>Create an Event</h2>
          </div>

          <div>
            <img
              src={file}
              alt="event"
              style={{
                width: "350px",
                height: "300px",
                marginTop: "1rem",
                marginBottom: "1rem",
              }}
            />
          </div>

          <div className="login-main">
            <div className="form-group">
              <input
                accept="image/*"
                type="file"
                className="form-control"
                placeholder="Enter title"
                onChange={(e) => {
                  setFile(URL.createObjectURL(e.target.files[0]));
                  setImg(e.target.files[0]);
                }}
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="Enter title"
                onChange={(e) =>
                  setValues({ ...values, title: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="Enter description"
                onChange={(e) =>
                  setValues({ ...values, description: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <input
                type="search"
                list="category"
                className="form-control"
                placeholder="Enter category"
                onChange={(e) =>
                  setValues({ ...values, category: e.target.value })
                }
              />

              <datalist id="category">
                <option value="Course" />
                <option value="Meetup" />
              </datalist>
            </div>

            <div className="form-group">
              <input
                type="datetime-local"
                className="form-control"
                placeholder="Enter date"
                onChange={(e) => setValues({ ...values, date: e.target.value })}
              />
            </div>

            <div className="form-group">
              <input
                type="number"
                className="form-control"
                placeholder="Enter price"
                step="0.01"
                onChange={(e) =>
                  setValues({ ...values, price: e.target.value })
                }
              />
            </div>

            <div>
              {values.error && <Alert variant="danger">{values.error}</Alert>}
            </div>

            <div className="login-buttons">
              <div>
                <button
                  type="button"
                  className="btn btn-primary btn-lg btn-block"
                  onClick={submitHandle}
                >
                  Submit
                </button>
              </div>

              <div>
                <button
                  type="button"
                  className="btn btn-danger btn-lg btn-block"
                  onClick={() => window.location.assign("/dashboard")}
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
