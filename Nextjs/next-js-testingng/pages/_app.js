import { ChakraProvider } from "@chakra-ui/react";
// import { BrowserRouter } from "react-router-dom";
export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider>
    
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
