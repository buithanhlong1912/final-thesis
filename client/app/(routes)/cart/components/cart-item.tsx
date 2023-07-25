import Image from "next/image";
import { toast } from "react-hot-toast";
import { X } from "lucide-react";
import { Product } from "@/type";
import useCart from "@/hooks/useCart";
import IconButton from "@/components/ui/IconButton";
import Currency from "@/components/ui/Currency";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface CartItemProps {
  data: Product;
  quantity: number;
}

const CartItem: React.FC<CartItemProps> = ({ data, quantity }) => {
  const cart = useCart();

  const onRemove = () => {
    cart.removeItem(data.id);
  };

  const onChangeProductQuantity = (event: any) => {
    event.preventDefault();

    cart.changeItemQuantity(data, event.target.value);
  };

  return (
    <li className="flex py-6 border-b">
      <div className="relative h-24 w-24 rounded-md overflow-hidden sm:h-48 sm:w-48">
        <Image
          fill
          src={data.images[0].url}
          alt=""
          className="object-cover object-center"
        />
      </div>
      <div className="relative ml-4 flex flex-1 flex-col justify-between sm:ml-6">
        <div className="absolute z-10 right-0 top-0">
          <IconButton onClick={onRemove} icon={<X size={15} />} />
        </div>
        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
          <div className="flex justify-between">
            <p className=" text-lg font-semibold text-black">{data.name}</p>
          </div>

          <div className="mt-1 flex text-sm">
            <p className="text-gray-500">{data.color.name}</p>
            <p className="ml-4 border-l border-gray-200 pl-4 text-gray-500">
              {data.brand.name}
            </p>
          </div>
          <Currency value={data.price} />
        </div>
        <div className="mt-4 text-sm grid grid-cols-2 gap-2 mr-5">
          {/* <p className="text-gray-500">Số lượng :</p> */}
          {/* <p className="text-gray-500 pl-2">
            
            </p> */}
          <Label
            htmlFor="quantity"
            className="flex items-center justify-center ml-32"
          >
            Số lượng
          </Label>
          <Input
            id="quantity"
            type="number"
            value={quantity}
            onChange={onChangeProductQuantity}
            className=""
          />
        </div>
      </div>
    </li>
  );
};

export default CartItem;
