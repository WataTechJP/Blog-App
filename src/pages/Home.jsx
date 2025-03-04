import { use, useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";


function Home() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchPosts = async () => {
      const querySnapshot = await getDocs(collection(db, "posts"));
      setPosts(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchPosts();
  }, []);

  const toCreatePage = () => {
    navigate("/create");
  }

  const toPostList = () => {
    navigate("/postList");
  }

  return (
    <div className="flex flex-col items-center text-center mx-auto mt-60 min-h-screen">
      <div className="text-3xl md:text-5xl xl:text-6xl font-bold my-6">
        <h1>Welcome To My Blog Channel</h1>
      </div>
      <div className=" bg-gray-100 rounded-md w-full md:w-7/12 p-6 my-10">
        <div className=" bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-black text-2xl font-bold mb-4">Leave Your Current Feeling</h2>
          <button onClick={toCreatePage} className="bg-red-500 hover:bg-red-700 text-white text-xl px-9 py-2 rounded-3xl">
            New Post Here
          </button>
        </div>
      </div>
       <div className="bg-gray-100 rounded-md max-w-7xl w-full p-6 my-5">
        <h2 className="flex flex-col text-center text-black font-bold text-4xl my-3">All Posts</h2>
        <div className=" bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-black text-2xl font-bold mb-4">See Your Precious Memories</h2>
          {posts.slice()
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // 降順ソート
          .slice(0, 4).map((post) => (
          <div key={post.id} className="mb-6 p-4 border rounded shadow-sm text-black">
              <h2 className="text-xl font-bold">{post.title}</h2>
              <p className="text-gray-500">{post.date}</p>
              <p>
              {post.content.split("\n").slice(0, 2).join("\n")}...
              </p>
              <Link to={`/show/${post.id}`} className="text-blue-500 underline mt-2"
              >
                Read More
              </Link>
          </div>
          ))}
          <button onClick={toPostList} className="bg-red-500 hover:bg-red-700 text-white px-6 py-2 rounded-lg">
            See More Posts
          </button>
        </div>
      </div>

      
    </div>
  );
}

export default Home;