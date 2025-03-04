import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import Button from "../components/common/Button";

function Home() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      const q = query(collection(db, "posts"), orderBy("createdAt", "desc")); // 🔹 Firestore で降順ソート
      const querySnapshot = await getDocs(q);

      setPosts(querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })));
    };

    fetchPosts();
  }, []);

  const toCreatePage = () => navigate("/create");
  const toPostList = () => navigate("/postList");

  return (
    <div className="flex flex-col items-center text-center mx-auto mt-60 min-h-screen">
      <div className="text-3xl md:text-5xl xl:text-6xl font-bold my-6">
        <h1>Welcome To My Blog Channel</h1>
      </div>
      <div className="text-black bg-gray-100 rounded-md w-full md:w-7/12 p-6 my-10">
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-black text-2xl font-bold mb-4">Leave Your Current Feeling</h2>
          <Button onClick={toCreatePage} className="bg-red-500 hover:bg-red-700 text-white text-xl px-9 py-2 rounded-3xl">New Post Here</Button>
        </div>
      </div>

      {/* 最新4件の投稿を表示 */}
      <div className="bg-gray-100 rounded-md max-w-7xl w-full p-6 my-5">
        <h2 className="flex flex-col text-center text-black font-bold text-4xl my-3">All Posts</h2>
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-black text-2xl font-bold mb-4">See Your Precious Memories</h2>
          
          {posts.slice(0, 4).map((post) => (
            <div key={post.id} className="mb-6 p-4 border rounded shadow-sm text-black">
              <h2 className="text-xl font-bold">{post.title}</h2>
              <p className="text-gray-500">{post.createdAt ? new Date(post.createdAt.seconds * 1000).toLocaleString() : "Unknown"}</p>

              {post.imageUrl && (
                <>
                  <label className="block font-medium mt-2">Image:</label>
                  <div>
                    <img src={post.imageUrl} alt={post.title} className="w-full h-auto rounded-lg shadow" />
                  </div>
                </>
              )}

              <p>{post.content.split("\n").slice(0, 2).join("\n")}...</p>

              <Link to={`/show/${post.id}`} className="text-blue-500 hover:text-white hover:bg-blue-500 font-semibold underline mt-2">
                Read More
              </Link>
            </div>
          ))}
          <Button onClick={toPostList} className="bg-red-500 hover:bg-red-700 text-white px-6 py-2 rounded-lg">
            See More Posts
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Home;