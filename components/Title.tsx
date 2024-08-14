import Link from "next/link";
import React from "react";

type Props = {};

function Title({}: Props) {
  return (
    <h1>
      <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
        Kjøpskontrakt
      </Link>
    </h1>
  );
}

export default Title;
