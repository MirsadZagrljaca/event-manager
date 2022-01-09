import { Alert } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { signin } from "./auth-api";
import authHelpers from "./auth-helpers";

export default function Login() {
  const [values, setValues] = useState({
    email: "",
    password: "",
    error: "",
    redirect: false,
  });

  useEffect(() => {
    if (sessionStorage.getItem("token"))
      return window.location.assign("/dashboard");
  }, []);

  const clickHandler = () => {
    let user = {
      email: values.email || undefined,
      password: values.password || undefined,
    };

    signin(user).then((response) => {
      if (response.error) {
        setValues({ ...values, error: response.error });
      } else {
        authHelpers.authenticate(response, () => {
          setValues({ ...values, error: "", redirect: true });
        });
      }
    });
  };

  if (values.redirect) {
    return window.location.assign("/dashboard");
  }

  return (
    <div className="login">
      <div>
        <div className="login-header">
          <h2>Login</h2>
        </div>

        <div className="login-main">
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
                Login
              </button>
            </div>

            <div>
              <p>or</p>
            </div>

            <div>
              <button
                type="button"
                className="btn btn-danger btn-lg btn-block"
                onClick={() => window.location.assign("/register")}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
