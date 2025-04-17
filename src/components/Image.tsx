"use client";
import { Image as IKImage } from "@imagekit/next";
import React from "react";

type ImageType = {
  path: string;
  w: number;
  h: number;
  alt: string;
  className?: string;
  tr?: boolean;
};

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT!;

const Image = ({ path, w, h, alt, className, tr }: ImageType) => {
  return (
    <IKImage
      urlEndpoint={urlEndpoint}
      src={path}
      alt={alt}
      //   lqip={{ active: true, quality: 20 }}
      className={className}
      width={w}
      height={h}
      {...(tr ? { transformation: [{ width: w, height: h }] } : {})}
    />
  );
};

export default Image;
