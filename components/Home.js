import { EthereumAuthProvider, useViewerConnection } from '@self.id/framework'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import { useState } from 'react'
import Button from './Button'
import H1 from './H1'
import dynamic from 'next/dynamic'
import ConnectButton from './ConnectButton'

export default function Home() {
  /* const [pippo, setPippo] = useState('world') */
  const [connection, connect, disconnect] = useViewerConnection()

  return (

    <div className='container mx-auto py-10 flex flex-col grow items-center justify-center gap-8'>
      {connection.status === 'connected' ? (
        <H1>Connected</H1>
      ) : ((typeof window !== 'undefined') && 'ethereum' in window) ? (
        <>
          <H1>Manage your events.<br />Without hassles.</H1>
          <ConnectButton />
        </>
      ) : (
        <p>
          An injected Ethereum provider such as{' '}
          <a href="https://metamask.io/">MetaMask</a> is needed to authenticate.
        </p>
      )}
    </div>
  )
}
