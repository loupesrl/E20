import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { ChevronDown } from 'react-feather';
import { EthereumAuthProvider, useViewerConnection } from '@self.id/framework'

export default function Header() {
  const [connection, connect, disconnect] = useViewerConnection()

  return (
    <header className="container mx-auto py-6 flex justify-between">
      <h1 className="text-5xl font-bold text-stone-800">
        Ξ20
      </h1>
      {connection.status === 'connected' && (
        <button className="text-xl border rounded-full py-3 px-6 border-black flex gap-4">{connection.selfID.id.substring(0, 14)}... <ChevronDown size={28} /></button>
      )}
    </header>
  );
}
