import { Alert } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import axios from "axios";
import base from "../../config";

export default function Register() {
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    error: "",
    redirect: false,
  });

  useEffect(() => {
    if (sessionStorage.getItem("token"))
      return window.location.assign("/dashboard");
  }, []);

  const clickHandler = async () => {
    let user = {
      firstName: values.firstName || undefined,
      lastName: values.lastName || undefined,
      email: values.email || undefined,
      password: values.password || undefined,
    };

    let response = await axios.post(`${base}/user/register`, user);

    if (response.data.error) {
      setValues({ ...values, error: response.data.error });
    } else {
      setValues({ ...values, error: "", redirect: true });
    }
  };

  if (values.redirect) {
    return window.location.assign("/");
  }

  return (
    <div className="login">
      <div>
        <div className="login-header">
          <h2>Register</h2>
        </div>

        <div className="login-main">
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter first name"
              onChange={(e) =>
                setValues({ ...values, firstName: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter last name"
              onChange={(e) =>
                setValues({ ...values, lastName: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              onChange={(e) => setValues({ ...values, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
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
                onClick={clickHandler}
              >
                Register
              </button>
            </div>

            <div>
              <p>or</p>
            </div>

            <div>
              <button
                type="button"
                className="btn btn-danger btn-lg btn-block"
                onClick={() => window.location.assign("/")}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
