export const dynamic = "force-dynamic";

import React from "react";
import { getCoupons } from "./actions";
import CouponsClient from "./CouponsClient";

export default async function AdminCuponsPage() {
  const coupons = await getCoupons();
  return <CouponsClient initialCoupons={coupons} />;
}
