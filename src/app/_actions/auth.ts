"use server";

import { prisma } from "@/lib/prisma";
import { createSession, destroySession } from "@/lib/session";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const email = (formData.get("email") as string)?.toLowerCase().trim();
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { error: "Invalid email or password." };
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return { error: "Invalid email or password." };
  }

  // Update last login timestamp
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() },
  });

  await createSession(user.id);

  if (user.role === "Cashier") {
    redirect("/pos");
  } else if (user.role === "Fuel Attendant") {
    redirect("/fuel");
  } else {
    redirect("/");
  }
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}
