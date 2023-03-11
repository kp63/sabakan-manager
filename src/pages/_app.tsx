import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react";
import { Provider as JotaiProvider } from "jotai";
import toast, { Toaster, ToastOptions } from "react-hot-toast";
import { ThemeProvider, useTheme } from "next-themes";
import { AnimatePresence } from "framer-motion";

import '../styles/globals.css'
import React, { useEffect } from "react";

const handleContextMenu = (e: MouseEvent) => e.preventDefault()

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const toastOptions: ToastOptions = {
    className: 'dark:!bg-gray-600 dark:!text-white',
  }

  useEffect(() => {
    document.body.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.body.removeEventListener("contextmenu", handleContextMenu);
    }
  })

  return (
    <SessionProvider session={session}>
      <JotaiProvider>
        <ThemeProvider>
          <AnimatePresence>
            <Component {...pageProps} />
          </AnimatePresence>
          <Toaster position="top-center" toastOptions={toastOptions} />
        </ThemeProvider>
      </JotaiProvider>
    </SessionProvider>
  )
}
