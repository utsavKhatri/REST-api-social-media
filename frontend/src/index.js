import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { MyContextProvider } from "./context";
import { ChakraProvider } from "@chakra-ui/react";
import { ApolloProvider } from "react-apollo";
import ApolloClient from "apollo-boost";

const client = new ApolloClient({
  uri: "http://localhost:1337/graphql",
  request: (operation) => {
    const token = localStorage.getItem("user-token");
    operation.setContext({
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ApolloProvider client={client}>
    <MyContextProvider>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </MyContextProvider>
  </ApolloProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
