import Head from "next/head";
import Image from "next/image";
import { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";
import { getBurnerWallet } from "../utils/burnerWallet";
import H1 from "./H1";

export default function User({ children }) {

  const [wallet, setWallet] = useState(null)
  useEffect(() => {
    async function loadWallet() {
      const _wallet = await getBurnerWallet()
      console.log(_wallet)
      setWallet(_wallet)
    }
    loadWallet()
  }, [])


  return (
    <div className="container mx-auto py-10 flex flex-col grow relative">
      {wallet ? (
        <H1>Your account is {wallet.address}</H1>
      ) : (
        <H1>We are recovering your account...</H1>
      )}
    </div>
  )
}
