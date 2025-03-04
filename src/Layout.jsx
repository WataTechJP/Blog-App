import { Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/layouts/Sidebar";
import Footer from "./components/layouts/Footer";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Login from "./pages/Login";
import Edit from "./pages/Edit";
import ShowPost from "./pages/ShowPost";
import PostList from "./pages/PostList";

function Layout() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";

  return (
    <div className="flex flex-col min-h-screen">

      {!isLoginPage && <Sidebar />}
      <div className="flex-1 p-4">
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/" element={<Login />} />
          <Route path="/show/:id" element={<ShowPost />} />
          <Route path="/postList" element={<PostList />} />"
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default Layout;



