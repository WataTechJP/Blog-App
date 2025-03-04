import { useState } from "react";
import { auth, provider } from "../firebase";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      toast.success("Login Successful!"); 
      setTimeout(() => {
        navigate("/home");
      }, 1500);
      console.log(result);
    } catch (error) {
      console.error(error);
      toast.warn(<div>
                  Something went wrong! <br /> Try again with other accounts.
                </div>); 
      setTimeout(() => {
        navigate("/");
      }, 1500);
    }
  };

  const signInWithEmail = async () => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login Successful!"); 
      setTimeout(() => {
        navigate("/home");
      }, 1500);
      console.log(result);
    } catch (error) {
      console.error(error);
      toast.warn(<div>
                  Something went wrong! <br /> Try again with other accounts.
                </div>); 
      setTimeout(() => {
        navigate("/");
      }, 1500);
    }
  };

  return (
    <>
     <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-7xl font-bold">BLOG APP</h1>
      <h2>By W.O.</h2>
        <h1 className="text-3xl my-5">Login to continue</h1>
        <input 
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-80 p-2 border text-black rounded"
        />
        <p className="text-red-700 mb-2">hint: wattjk5971usgo@gmail.com</p>
        <input 
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-80 p-2 border text-black rounded"
        />
        <p className="text-red-700 mb-4">hint: wattech</p>

        <div className="flex flex-col text-center items-center justify-center">
          <button 
            onClick={signInWithEmail}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg"
          >
            Login with Email and Password
          </button>
          <h1 className="text-black my-3">OR</h1>
          <button 
            onClick={signInWithGoogle}
            className="bg-red-500 text-white px-6 py-2 rounded-lg"
          >
            Login with Google
          </button>
      </div>
    </div>
    
    </>
  );
}

export default Login;