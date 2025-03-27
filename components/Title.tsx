import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Car } from "lucide-react";

interface TitleProps {
  className?: string;
  href?: string;
}

const Title: React.FC<TitleProps> = ({ className, href = "/" }) => {
  return (
    <div className="flex items-center">
      <Link
        href={href}
        className="flex items-center space-x-2 no-underline text-inherit hover:text-blue-600 transition-colors"
      >
        <Car className="h-5 w-5 text-blue-600" />
        <h1 className={cn("font-bold m-0 p-0", className)}>
          Kjøpskontrakt-bil
        </h1>
      </Link>
    </div>
  );
};

export default Title;
