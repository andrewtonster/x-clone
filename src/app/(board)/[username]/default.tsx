import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/prisma";

const NotFound = async () => {
  redirect(`.`);
};

export default NotFound;
