import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>hello world</title>
        <meta name="description" content="hello world" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>Hello World</h1>

    </div>
  )
}

export default Home
