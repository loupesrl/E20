import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

export default function Button({ children, variant = "primary", ...props }) {
  let style = "";
  if (variant === "primary") style = "bg-stone-700 text-white";
  else if (variant === "fab")
    style = "absolute bottom-0 right-0 bg-stone-700 text-white mb-8";
  else if (variant === "secondary")
    style = "bg-white text-stone-700 border border-stone-700";

  return (
    <button {...props} className={`text-xl ${style} rounded-md py-3 px-6`}>
      {children}
    </button>
  );
}
