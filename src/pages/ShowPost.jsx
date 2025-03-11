import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import Button from "../components/common/Button";

function ShowPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      const docRef = doc(db, "posts", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setPost({ id: docSnap.id, ...docSnap.data() });
      } else {
        console.log("No such document!");
        navigate("/"); // Redirect to the home page if the post doesn't exist
      }
    };

    fetchPost();
  }, [id, navigate]);

  if (!post) {
    return <div className="text-center text-gray-500 mt-10">Loading...</div>;
  }

  return (
    <div className="bg-gray-100 rounded-md max-w-2xl mx-auto w-full p-6 my-5 shadow-lg">
      {/* Title */}
      <h2 className="text-center text-black font-bold text-3xl mb-5">{post.title}</h2>

      <div className="bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-black text-2xl font-bold mb-4">{post.title}</h2>
        <p className="text-gray-500 mb-4">{new Date(post.createdAt.seconds * 1000).toLocaleString()}</p>

        {/* Image */}
        {post.imageUrl && (
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            className="w-full h-auto max-h-[400px] object-cover rounded-lg shadow mb-4"
          />
        )}

        {/* Content */}
        <p className="text-black whitespace-pre-wrap break-words">
          {post.content}
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row justify-center sm:justify-between sm:w-3/4 mx-auto gap-3 mt-3">
        <Button 
          onClick={() => navigate("/postList")} 
          className="bg-red-500 hover:bg-red-700 text-white px-6 py-2 rounded-lg w-full sm:w-auto text-center"
        >
          Back To Post List
        </Button>
        <Button 
          onClick={() => navigate("/home")} 
          className="bg-red-500 hover:bg-red-700 text-white px-6 py-2 rounded-lg w-full sm:w-auto text-center"
        >
          Back To Home
        </Button>
      </div>
    </div>
  );
}

export default ShowPost;
