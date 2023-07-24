import { Billboard } from "@/type";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/billboards`;

const getTopBillboard = async (): Promise<Billboard> => {
  const res = await fetch(`${URL}`);
  const billboardsArray = await res.json();

  return billboardsArray[0];
};

export default getTopBillboard;
