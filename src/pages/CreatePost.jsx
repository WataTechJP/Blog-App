import { useState } from "react";
import { db, auth, storage } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function CreatePost() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(""); // アップロード後のURLを保存
  const navigate = useNavigate();


  const createPost = async () => {
  if (!auth.currentUser) {
    toast.warn("Please login first", { autoClose: 3000 });
    return;
  }

  if (!title || !content) {
    if (!window.confirm("Title or Content is empty. Do you want to post anyway?")) {
      return;
    }
  }

  try {
    let uploadedImageUrl = "";
    if (image) {
      const imageRef = ref(storage, `posts/${auth.currentUser.uid}_${image.name}`);
      const metadata = { customMetadata: { owner: auth.currentUser.uid } };

      await uploadBytes(imageRef, image, metadata);
      uploadedImageUrl = await getDownloadURL(imageRef);
    }

    const docRef = await addDoc(collection(db, "posts"), {
      title: title || "Untitled",
      date,
      content: content || "No Content",
      imageUrl: uploadedImageUrl,
      author: {
        name: auth.currentUser.displayName,
        uid: auth.currentUser.uid,
      },
      createdAt: serverTimestamp(),
    });

    toast.success("Post created successfully!", { autoClose: 2000 });
    navigate("/home");
  } catch (error) {
    console.error("Error adding document: ", error);
    toast.error("Failed to create post. Please try again later.", { autoClose: 3000 });
  }
};

  

  const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setImage(file);

  const reader = new FileReader();
  reader.onloadend = () => setImageUrl(reader.result);
  reader.readAsDataURL(file);
};

  const handleCancelImage = () => {
    setImage(null);
    setImageUrl("");
    document.getElementById("image").value = "";
  };

  const toHome = () => {
    navigate("/home");
  };


  return (
    <div className="flex flex-col items-center max-w-2xl mx-auto mt-10">
      <div className="text-4xl font-bold my-5">
        <h1>Record your current mood</h1>
      </div>
      <div className="min-w-full"><label htmlFor="title" className="font-bold text-xl">Title: {title}</label>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded mb-4 text-black dark:bg-gray-800 dark:text-white"
          id="title"
          name="title"
        />
        <div className="mb-4"><label htmlFor="image" className="font-bold text-xl">Image:</label><br />
            {imageUrl && (
              <div>
                <img src={imageUrl} alt="Preview" className="w-auto h-auto object-cover rounded-lg mb-2" />
                {imageUrl && (
                  <button 
                    onClick={handleCancelImage} 
                    className="bg-red-500 text-white text-sm px-2 py-1 mb-2 rounded-lg"
                  >
                    Remove This Image
                  </button>
                )}
              </div>
            )}
            
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange} 
              id="image"
              name="image"
            />
          </div>

        <label htmlFor="content" className="font-bold text-xl">Content:</label>
        <textarea
          placeholder="How do you feel now?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border rounded mb-4 text-black dark:bg-gray-800 dark:text-white"
          id="content"
          name="content"
          cols="30"
          rows="10"
        />
      </div>

      <div className="flex justify-center mb-6">
        <Button onClick={createPost} className="bg-green-500 hover:bg-green-700 text-white px-6 py-2 rounded-lg mr-20">
          Post
        </Button>
        <Button onClick={toHome} className="bg-red-500 hover:bg-red-700 text-white px-6 py-2 rounded-lg">
          Cancel
        </Button>
      </div>
    </div>
  );
}

export default CreatePost;
