import { ShoppingCartIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const NavbarCart = () => {
  return (
    <Link href="/cart" className="relative">
      <ShoppingCartIcon className="h-6 w-6 text-gray-700" />
      <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
        3
      </span>
    </Link>
  );
};

export default NavbarCart;
