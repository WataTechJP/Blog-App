import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { db, auth, storage } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import Button from "../components/common/Button";

function CreatePost({ handleClose }) {  
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [postSuccess] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (postSuccess) {
      navigate("/home");
    }
  }, [postSuccess, navigate]);

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

      if (!docRef.id) {
        throw new Error("Failed to retrieve document ID");
      }

      toast.success("Post created successfully!", { autoClose: 2000 });

      if (typeof handleClose === "function") {
          handleClose();
          
        }

        setTimeout(() => {
          navigate("/home");
          window.location.reload();
        }, 3000); // Reload the page after 3 seconds
      } catch (error) {
        console.error("Error adding document: ", error);
        toast.error("Failed to create post. Please try again later.", { autoClose: 3000 });
      }
  };

  return (
    <div className="flex flex-col items-center max-w-2xl mx-auto mt-10">
      <div className="text-[clamp(1.5rem,5vw,2.5rem)] font-bold my-5 text-center">
        <h1>Record your current mood</h1>
      </div>
      <div className="min-w-full">
        <label htmlFor="title" className="font-bold text-xl">Title: {title}</label>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded mb-4 text-black dark:bg-gray-800 dark:text-white"
          id="title"
          name="title"
          maxLength={25}
        />
        <div className="mb-4">
          <label htmlFor="image" className="font-bold text-xl">Image:</label><br />
          {imageUrl && (
            <div>
              <img src={imageUrl} alt="Preview" className="w-auto h-auto object-cover rounded-lg mb-2" />
              {imageUrl && (
                <button 
                  onClick={() => { setImage(null); setImageUrl(""); }}
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
            onChange={(e) => { setImage(e.target.files[0]); setImageUrl(URL.createObjectURL(e.target.files[0])); }} 
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
      <div className="flex flex-wrap justify-center gap-4 mb-6 w-full">
        <Button 
          onClick={createPost} 
          className="bg-green-500 hover:bg-green-700 text-white px-6 py-2 rounded-lg w-1/3 min-w-[120px]"
        >
          Post
        </Button>
        
        <Button 
          onClick={() => { 
            setTitle(""); 
            setDate(""); 
            setContent(""); 
            setImage(null); 
            setImageUrl(""); 
          }} 
          className="bg-yellow-500 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg w-1/3 min-w-[120px]"
        >
          Clear
        </Button>
        
        <Button 
          onClick={handleClose} 
          className="bg-red-500 hover:bg-red-700 text-white px-6 py-2 rounded-lg w-1/3 min-w-[120px]"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

export default CreatePost;
