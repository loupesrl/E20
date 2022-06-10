import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

export default function Button({ children, ...props }) {
  return (
    <button {...props} className="text-xl bg-stone-700 text-white rounded-md py-3 px-6" > {children}</button >
  );
}
