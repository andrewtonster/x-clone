"use client";
import { IKVideo } from "imagekitio-next";
import React from "react";

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;
type VideoTypes = {
  path: string;
  className?: string;
};
export const Video = ({ path, className }: VideoTypes) => {
  return (
    <IKVideo
      urlEndpoint={urlEndpoint}
      path={path}
      className={className}
      transformation={[
        { width: "1920", height: "1080", quality: 90 },
        { raw: "l-text, i-Andrew,fs-100,co-white, l-end" },
      ]}
      controls
    />
  );
};
