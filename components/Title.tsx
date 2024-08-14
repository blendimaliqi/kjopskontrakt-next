import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface TitleProps {
  className?: string;
  href?: string;
}

const Title: React.FC<TitleProps> = ({ className, href = "/" }) => {
  return (
    <h1 className={cn("font-bold m-0 p-0", className)}>
      <Link
        href={href}
        className="no-underline text-inherit hover:text-gray-700 transition-colors"
      >
        Kontrakt til PDF generator
      </Link>
    </h1>
  );
};

export default Title;
