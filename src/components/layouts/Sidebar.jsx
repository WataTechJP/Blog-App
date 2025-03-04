import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

 
const Sidebar = () => {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logout Successful!");

      // 1.5秒後にログインページへ遷移
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      console.error("❌ ログアウトエラー:", error);
      alert("Logout Failed: " + error.message);
    }
  };


  return (
    <>
      {/* ☰ メニューアイコン（左上に固定） */}
       {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 bg-gray-800 text-white p-2 rounded-md z-50"
        >
          ☰ Menu
        </button>
      )}

      {/* 📌 Close & Logout ボタン（サイドバーの外） */}
      {isOpen && (
        <div className="fixed top-4 left-48 flex flex-col space-y-2 z-50">
          <button
            onClick={() => setIsOpen(false)}
            className="bg-red-600 hover:bg-red-800 text-white px-4 py-2 rounded-lg shadow-lg"
          >
            ✕ Close
          </button>
          <button
            onClick={handleLogout}
            className="bg-white hover:bg-red-300 text-red-600 border border-red-600 px-4 py-2 rounded-lg shadow-lg"
          >
            Logout
          </button>
        </div>
      )}

      {/* 📌 サイドバー */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-800 opacity-70 text-white w-48 transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-64"
        } z-40 flex flex-col justify-between`}
      >
        {/* ヘッダー部分 */}
        <div className="px-3 text-center text-4xl font-bold">
          <h1>BLOG<br/> APP</h1>
        </div>
        <div className="text-right px-3 text-xl ">
            <h1>By W.O.</h1>
        </div>

        {/* ナビゲーションメニュー */}
        <ul className="flex-grow text-xl">
          <li className="p-3 cursor-pointer transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:bg-gray-700">
            <a href="/home" className="block w-full h-full">
            <img src="../../../public/icons/home.svg" alt="" width={25} height={25} className="inline-block mr-2 mb-2"/>
            Home</a>
          </li>
          <li className="p-3 cursor-pointer transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:bg-gray-700">
            <a href="/postList" className="block w-full h-full"><img src="../../../public/icons/postList.svg" alt="" width={25} height={25} className="inline-block mr-2 mb-2"/>
            All Posts</a>
          </li>
          <li className=" p-3 cursor-pointer transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:bg-gray-700">
            <a href="/create" className="block w-full h-full"><img src="../../../public/icons/newPost.svg" alt="" width={25} height={25} className="inline-block mr-2"/>
            New Post</a>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;