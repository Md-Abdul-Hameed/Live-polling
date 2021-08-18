import React, { useEffect, useState } from "react";
import { database } from "../firebase/firebaseConfig";
import Footer from "./Footer";
import Header from "./Header";

export default function MyPolls() {
  return (
    <>
      <Header />

      <Footer />
    </>
  );
}
