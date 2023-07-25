"use client";

import useCart from "@/hooks/useCart";
import Currency from "@/components/ui/Currency";
import CheckoutForm from "./checkout-form";

const Summary = () => {
  const items = useCart((state) => state.items);

  const totalPrice = items.reduce((total, item) => {
    return total + Number(parseInt(item.data.price) * item.quantity);
  }, 0);

  return (
    <div className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
      <h2 className="text-lg font-medium text-gray-900">Order summary</h2>
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-base font-medium text-gray-900">Tổng tiền</div>
          <Currency value={totalPrice} />
        </div>
      </div>
      {items.length > 0 && <CheckoutForm />}
    </div>
  );
};

export default Summary;
