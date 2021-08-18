import React from "react";

export default function Footer() {
  return (
    <div className="footer">
      <p className="footer-text">
        Built with ❤ by{" "}
        <a
          className="profile"
          href="https://www.github.com/abdul-imad"
          target="_blank"
          rel="noreferrer"
        >
          Imad{" "}
        </a>
        &amp;{" "}
        <a
          className="profile"
          href="https://github.com/Md-Abdul-Hameed"
          target="_blank"
          rel="noreferrer"
        >
          Hameed
        </a>
      </p>
    </div>
  );
}
