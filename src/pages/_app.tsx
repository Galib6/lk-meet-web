import { queryClient } from '@lib/config';
import { QueryClientProvider } from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../@styles/main.scss';

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Meet</title>
        <meta name="description" content="" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
      <ToastContainer />
    </>
  );
}

export default App;
