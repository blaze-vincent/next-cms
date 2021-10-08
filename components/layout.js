import Head from 'next/head'

export default function Layout(props) {
  return (
    <div>
      <Head>
        <title></title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        {props.children}
      </main>

      <footer>
          
      </footer>
    </div>
  )
}
