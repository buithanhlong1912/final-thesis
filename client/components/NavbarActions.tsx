import React from "react";
import Button from "./ui/Button";
import { ShoppingBag } from "lucide-react";

const NavbarActions = () => {
  return (
    <div className="ml-auto flex items-center gap-x-4">
      <Button className="ml-auto items-center rounded-full bg-black px-4 py-2">
        <ShoppingBag size={20} color="white" />
      </Button>
    </div>
  );
};

export default NavbarActions;
