import React from "react";
import Header from "./Header";
import Footer from "./Footer";

export default function Error() {
  return (
    <>
      <Header />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1>Error:404!! Page not found</h1>
      </div>
      <Footer />
    </>
  );
}
