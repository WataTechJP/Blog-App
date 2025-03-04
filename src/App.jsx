import { BrowserRouter as Router } from "react-router-dom";
import Layout from "./Layout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
  return (
    <Router>
      <ToastContainer 
      position="top-center"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable 
      pauseOnHover=
      {false}
      theme="dark" 
      />
      <Layout />
    </Router>
  );
}

export default App;