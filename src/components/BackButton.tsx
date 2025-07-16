"use client";

import React from "react";
import Image from "./Image";
const BackButton = () => {
  return (
    <button onClick={() => window.history.back()} className="cursor-pointer">
      <Image path="icons/back.svg" alt="back" w={24} h={24} />
    </button>
  );
};

export default BackButton;
