import Head from "next/head";
import Image from "next/image";
import { useState, useEffect, useContext } from "react";
import styles from "../styles/Home.module.css";
import { getBurnerWallet, WalletContext } from "../utils/burnerWallet";
import H1 from "./H1";
import Link from "next/link";

export default function User({ children }) {

  const { wallet, setWallet } = useContext(WalletContext)

  useEffect(() => {
    async function loadWallet() {
      const _wallet = await getBurnerWallet()
      setWallet(_wallet)
    }
    loadWallet()
  }, [setWallet])


  return (
    <div className="container mx-auto py-10 flex flex-col grow relative">
      {wallet ? (
        <div>
          <H1>Your account is {wallet.address}</H1>
          <Link href="/poll">
            <a className="border rounded-md p-4 shadow-lg">Poll</a>
          </Link>
        </div>
      ) : (
        <H1>We are recovering your account...</H1>
      )}
    </div>
  )
}
