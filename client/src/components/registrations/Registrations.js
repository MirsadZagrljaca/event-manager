import axios from "axios";
import React, { useState, useEffect } from "react";
import base from "../../config";
import Header from "../core/Header";

export default function Registrations() {
  const [registrations, setRegistrations] = useState([]);
  const [user, setUser] = useState({});
  const [render, setRender] = useState(false);

  useEffect(async () => {
    if (!sessionStorage.getItem("token")) return window.location.assign("/");
    if (!sessionStorage.getItem("id")) return window.location.assign("/");

    let id = sessionStorage.getItem("id");

    axios.get(`${base}/user/${id}`).then((response) => {
      setUser(response.data);
    });

    let response = await axios.post(`${base}/api/user/events`, { id: id });
    let tempEventIds = [];

    response.data.map((v, i) => {
      tempEventIds.push(v._id);
    });

    axios.get(`${base}/registration`).then((res) => {
      let tempReg = [];

      res.data.map((v, index) => {
        for (let i = 0; i < tempEventIds.length; i++) {
          if (v.event !== null) {
            if (v.event._id === tempEventIds[i]) {
              tempReg.push(v);
            }
          }
        }
      });
      setRegistrations(tempReg);
    });
  }, []);

  const approve = async (id) => {
    let res = await axios.post(`${base}/registration/${id}/approvals`);

    if (res.data.error) {
      console.log(res.data.error);
    } else {
      let temp = registrations;

      registrations.map((v, i) => {
        if (v._id === id) {
          temp[i].status = "Approved";
        }
      });

      setRegistrations(temp);
      setRender(!render);
    }
  };

  const reject = async (id) => {
    let res = await axios.post(`${base}/registration/${id}/rejections`);

    if (res.data.error) {
      console.log(res.data.error);
    } else {
      let temp = registrations;

      registrations.map((v, i) => {
        if (v._id === id) {
          temp[i].status = "Rejected";
        }
      });

      setRegistrations(temp);
      setRender(!render);
    }
  };

  return (
    <>
      <Header />

      <div className="reg-flex">
        <div className="reg-mapping">
          {registrations.length &&
            registrations.map((v, i) => {
              return (
                <div className="reg-single" key={i}>
                  <div className="reg-single-top">
                    <h4>{v.event.title}</h4>
                  </div>

                  <div className="reg-single-mid">
                    <h6>
                      Event Date: {v.event.date} Event Price: {v.event.price}{" "}
                      User email: {v.user.email} Event Status:{" "}
                      {v.status === "Pending" && (
                        <span className="pending">{v.status}</span>
                      )}
                      {v.status === "Approved" && (
                        <span className="approved">{v.status}</span>
                      )}
                      {v.status === "Rejected" && (
                        <span className="rejected">{v.status}</span>
                      )}
                    </h6>
                  </div>

                  <div className="reg-single-bottom">
                    <button
                      type="button"
                      className="btn btn-secondary btn-lg btn-block"
                      disabled={v.status !== "Pending"}
                      onClick={() => approve(v._id)}
                    >
                      Approve
                    </button>

                    <button
                      type="button"
                      className="btn btn-danger btn-lg btn-block"
                      disabled={v.status !== "Pending"}
                      onClick={() => reject(v._id)}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}
