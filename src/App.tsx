import React from 'react';
import './App.css';
import {ThemeProvider} from "@mui/material";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {theme} from "./theme";
import Routing from "./routes/Routing";
import { AuthProvider } from './components/AuthProvider';

function App() {
  return (
      <div>
          <AuthProvider>
        <ThemeProvider theme={theme}>

          <ToastContainer
              position="bottom-left"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
          />
          <Routing />
        </ThemeProvider>
          </AuthProvider>
      </div>
  );
}

export default App;
