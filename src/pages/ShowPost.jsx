import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import Button from "../components/common/Button";

function ShowPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [showFull, setShowFull] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      const docRef = doc(db, "posts", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setPost({ id: docSnap.id, ...docSnap.data() });
      } else {
        console.log("No such document!");
        navigate("/"); // 投稿が存在しない場合、一覧ページへリダイレクト
      }
    };

    fetchPost();
  }, [id, navigate]);

  if (!post) {
    return <div className="text-center text-gray-500 mt-10">Loading...</div>;
  }

  return (
    <div className="bg-gray-100 rounded-md max-w-3xl mx-auto w-full p-6 my-5 shadow-lg min-h-screen">
      <h2 className="text-center text-black font-bold text-3xl mb-5">{post.title}</h2>

      <div className="bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-black text-2xl font-bold mb-4">{post.title}</h2>
        <p className="text-gray-500 mb-4">{new Date(post.createdAt.seconds * 1000).toLocaleString()}</p>

        {post.imageUrl && (
          <img src={post.imageUrl} alt={post.title} className="w-full h-auto max-h-[500px] object-cover rounded-lg shadow mb-4 transition-transform duration-500 hover:scale-105" />
        )}

        <p className="text-black">
          {showFull ? post.content : post.content.split("\n").slice(0, 2).join("\n") + "..."}
        </p>

        <button 
          onClick={() => setShowFull(!showFull)} 
          className="text-blue-500 underline mt-4"
        >
          {showFull ? "Close" : "Read More"}
        </button>
      </div>
      <div className="flex flex-row justify-between">
        <Button 
        onClick={() => navigate("/postList")} 
        className="float-right bg-red-500 hover:bg-red-700 text-white px-6 py-2 rounded-lg mt-4 block mx-auto"
      >
        Back To Post List
      </Button>
      <Button 
        onClick={() => navigate("/home")} 
        className="bg-red-500 hover:bg-red-700 text-white px-6 py-2 rounded-lg mt-4 block mx-auto"
      >
        Back To Home
      </Button>
      </div>
      
    </div>
  );
}

export default ShowPost;
