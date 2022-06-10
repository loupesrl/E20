import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

export default function H1({ children }) {
  return (
    <h1 className="text-4xl text-stone-800 font-bold">{children}</h1>
  );
}
