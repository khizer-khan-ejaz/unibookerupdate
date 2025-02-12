import type { AppProps } from "next/app";
import "@/styles/globals.css";  // Tailwind should come first
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap comes after
import 'react-toastify/dist/ReactToastify.css';

import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import { AuthProvider } from "../context/AuthContext";
import { useState, useEffect } from "react";
import Router from "next/router";
import LoadingSkeleton from "./components/common/LoadingSkeleton";
import { Jost } from "next/font/google";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "@/context/ThemeContext";
import { SessionProvider } from "next-auth/react";
const jostFont = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleRouteChangeStart = () => setLoading(true);
    const handleRouteChangeComplete = () => setLoading(false);
    const handleRouteChangeError = () => setLoading(false);
    Router.events.on("routeChangeStart", handleRouteChangeStart);
    Router.events.on("routeChangeComplete", handleRouteChangeComplete);
    Router.events.on("routeChangeError", handleRouteChangeError);
    return () => {
      Router.events.off("routeChangeStart", handleRouteChangeStart);
      Router.events.off("routeChangeComplete", handleRouteChangeComplete);
      Router.events.off("routeChangeError", handleRouteChangeError);
    };
  }, []);

  return (
    <SessionProvider session={pageProps.session}>
    <AuthProvider>
      <ThemeProvider>
        <Header />
      
          
       
          <div className={jostFont.variable}>
            <Component {...pageProps} />
          </div>
      
        <Footer />
        <ToastContainer />
      </ThemeProvider>
    </AuthProvider>
    </SessionProvider>
  );
}
