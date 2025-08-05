import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'
import Head from 'next/head'
import '@/styles/globals.css'
import Layout from '@/components/Layout'

const inter = Inter({ subsets: ['latin'] })

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={inter.className}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </div>
  )
}