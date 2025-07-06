import { Toaster } from "@/components/ui/toaster";
import { useAuthInitializer } from '@/hooks/useAuthInitializer';
import { store } from '@/store';
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from 'react-redux';

function AppContent({ Component, pageProps }: { Component: AppProps['Component'], pageProps: AppProps['pageProps'] }) {
  // Initialize auth on app startup
  useAuthInitializer();
  
  return (
    <>
      <Component {...pageProps} />
      <Toaster />
    </>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <AppContent Component={Component} pageProps={pageProps} />
    </Provider>
  );
}
