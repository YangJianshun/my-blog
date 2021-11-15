import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>my blog</title>
        <meta name="description" content="my blog" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>Hello World</h1>
    </div>
  )
}

export default Home
