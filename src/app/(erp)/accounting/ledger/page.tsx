import React from "react";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import LedgerClient from "./LedgerClient";

export const dynamic = "force-dynamic";

export default async function GeneralLedgerPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return <LedgerClient />;
}
