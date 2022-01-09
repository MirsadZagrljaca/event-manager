import React from "react";
import { Button } from "react-bootstrap";

export default function Header() {
  const clickHandler = () => {
    sessionStorage.removeItem("token");
    window.location.assign("/");
  };

  return (
    <div className="header">
      <div className="dropdown">
        <button
          className="btn btn-outline-dark dropdown-toggle"
          type="button"
          id="dropdownMenuButton"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-list"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
            />
          </svg>
        </button>
        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <a className="dropdown-item" href="/event/create">
            Create Event
          </a>
          <a className="dropdown-item" href="/dashboard">
            Dashboard
          </a>
          <a className="dropdown-item" href="/registrations">
            My Registrations
          </a>
        </div>
      </div>

      <div>
        <Button variant="outline-dark" onClick={clickHandler}>
          Logout
        </Button>
      </div>
    </div>
  );
}
