import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      const docRef = doc(db, "posts", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setPost(data);
        setTitle(data.title);
        setDate(data.date);
        setContent(data.content);
      } else {
        console.log("No such document!");
      }
    };

    fetchPost();
  }, [id]);

  const updatePost = async () => {
    if (!auth.currentUser) return;

    const postRef = doc(db, "posts", id);
    await updateDoc(postRef, {
      title,
      date,
      content,
    });

    navigate("/home");
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />
      <input
        type="date"
        className="w-full p-2 border rounded mb-4"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-2 border rounded mb-4"
        />
    </div>
    );
}

export default Edit;