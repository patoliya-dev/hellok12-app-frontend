import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/tailwind.css";
import "./styles/index.css";
import store from "app/store";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-tooltip/dist/react-tooltip.css";
import SocketProvider from "./services/sockets/ws";
import SocketListener from "./components/sockets/SocketListener";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <SocketProvider>
      <SocketListener />
      <App />
      <ToastContainer position="top-right" autoClose={2000} />
    </SocketProvider>
  </Provider>
);
