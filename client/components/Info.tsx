"use client";

import { ShoppingCart } from "lucide-react";

import Currency from "@/components/ui/Currency";
import Button from "@/components/ui/Button";
import { Product } from "@/type";
import useCart from "@/hooks/useCart";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState } from "react";

interface InfoProps {
  data: Product;
}

const Info: React.FC<InfoProps> = ({ data }) => {
  const [quantity, setQuantity] = useState(0);
  const cart = useCart();

  const onAddToCart = () => {
    cart.addItem(data, quantity);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">{data.name}</h1>
      <div className="mt-3 flex items-end justify-between">
        <p className="text-2xl text-gray-900">
          <Currency value={data?.price} />
        </p>
      </div>
      <hr className="my-4" />
      <div className="flex flex-col gap-y-6">
        <div className="flex items-center gap-x-4">
          <h3 className="font-semibold text-black">Hãng:</h3>
          <div>{data?.brand?.name}</div>
        </div>
        <div className="flex items-center gap-x-4">
          <h3 className="font-semibold text-black">Màu sắc:</h3>
          <div
            className="h-6 w-6 rounded-full border border-gray-600"
            style={{ backgroundColor: data?.color?.value }}
          />
        </div>
      </div>
      <div className="mt-8">
        <Label htmlFor="quantity" className="mt-8">
          Số lượng
        </Label>
        <Input
          id="quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
        />
      </div>
      <div className="mt-10 flex items-center gap-x-3">
        <Button onClick={onAddToCart} className="flex items-center gap-x-2">
          Thêm vào giỏ hàng
          <ShoppingCart size={20} />
        </Button>
      </div>
    </div>
  );
};

export default Info;
