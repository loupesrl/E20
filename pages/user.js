import { EthereumAuthProvider, useViewerConnection } from "@self.id/framework";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import { useState } from "react";
import Button from "../components/Button";
import H1 from "../components/H1";
import dynamic from "next/dynamic";

const User = dynamic(() => import("../components/User"), { ssr: false });

export default function Index() {
  return <User />
}
