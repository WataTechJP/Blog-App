import { useState, useEffect } from "react";
import { auth, provider } from "../firebase";
import { signInWithEmailAndPassword, signInWithPopup, getRedirectResult } from "firebase/auth";
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
      console.log("Login successful:", result);
      toast.success("Login Successful!");
      setTimeout(() => {
        navigate("/home");
      }, 1500);
    } catch (error) {
      console.error("Google Login error:", error);
      toast.warn(<p>Google Login failed:<br/>You aren't allowed to login with Google.</p>);
    }
  };

  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          console.log("Login successful:", result);
          toast.success("Login Successful!");
          setTimeout(() => {
            navigate("/home");
          }, 1500);
        }
      })
      .catch((error) => {
        console.error("Error getting redirect result:", error);
      });
  }, [navigate]);

  const signInWithEmail = async () => {
    if (!email || !password) {
      toast.warn("Please enter your email and password.");
      return;
    }
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log("Login successful:", result);
      toast.success("Login Successful!");
      setTimeout(() => {
        navigate("/home");
      }, 1500);
    } catch (error) {
      console.error("Login error:", error);
      toast.warn(<p>Login failed:<br />You aren't allowed to login with the provided email and password.</p>);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-7xl font-bold">BLOG APP</h1>
      <h2>By W.O.</h2>
      <h1 className="text-3xl my-5">Login to start</h1>
      <input 
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-80 p-2 border text-black rounded mb-2"
      />
      <input 
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-80 p-2 border text-black rounded mb-4"
      />
      <div className="flex flex-col text-center items-center justify-center">
        <button onClick={signInWithEmail} className="bg-blue-500 text-white px-6 py-2 rounded-lg">
          Login with Email and Password
          <img src="/icons/email.svg" alt="" width={20} height={20} className="inline-block ml-2"/>
        </button>
        <h1 className="text-black my-3">OR</h1>
        <button onClick={signInWithGoogle} className="bg-red-500 text-white px-6 py-2 rounded-lg">
          Login with Google<img src="/icons/google.svg" alt="" width={20} height={20} className="inline-block ml-2 bg-white rounded-full"/>
        </button>
      </div>
    </div>
  );
}

export default Login;