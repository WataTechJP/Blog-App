import { useState } from "react";
import { db, auth, storage } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";

function CreatePost() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(""); // アップロード後のURLを保存
  const navigate = useNavigate();

  // 📌 Firebase に投稿データを保存
  const createPost = async () => {
  if (!auth.currentUser) {
    console.log('❌ No user logged in');
    return;
  }

  try {
    console.log("✅ 投稿データを準備中...");
    
    let uploadedImageUrl = "";
    if (image) {
      console.log("📌 画像をアップロード中...");
      const imageRef = ref(storage, `posts/${image.name}`);
      await uploadBytes(imageRef, image);
      uploadedImageUrl = await getDownloadURL(imageRef);
      console.log("✅ 画像URL:", uploadedImageUrl);
    }

    const docRef = await addDoc(collection(db, "posts"), {
      title,
      date,
      content,
      imageUrl: uploadedImageUrl, // 画像のURLを保存
      author: {
        name: auth.currentUser.displayName,
        uid: auth.currentUser.uid,
      },
      createdAt: serverTimestamp(),
    });

    console.log("✅ Firestore に投稿完了！ Doc ID:", docRef.id);
    navigate("/home");
  } catch (error) {
    console.error("❌ Firestore 投稿エラー:", error);
  }
};

  // 📌 画像選択 & プレビュー表示
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result); // プレビュー用に画像URLをセット
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancelImage = () => {
    setImage(null);
    setImageUrl("");
    document.getElementById("image").value = "";
  };


  return (
    <div className="flex flex-col items-center max-w-2xl mx-auto mt-10">
      <div className="text-4xl font-bold my-5">
        <h1>Record your current mood</h1>
      </div>

      
      {/* 入力フィールド */}
      <div className="min-w-full"><label htmlFor="title" className="font-bold text-xl">Title:</label>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded mb-4 text-black"
          id="title"
          name="title"
        />
        {/* 画像アップロード */}
        <div className="mb-4"><label htmlFor="image" className="font-bold text-xl">Image:</label><br />
            {imageUrl && (
              <div>
                <img src={imageUrl} alt="Preview" className="w-auto h-auto object-cover rounded-lg mb-2" />
                {/* 📌 画像があるときだけ "Remove Image" ボタンを表示 */}
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
          className="w-full p-2 border rounded mb-4 text-black"
          id="content"
          name="content"
          cols="30"
          rows="10"
        />
      </div>

      {/* ボタン */}
      <div className="flex justify-center">
        <button onClick={createPost} className="bg-green-500 text-white px-6 py-2 rounded-lg mr-20">
          Post
        </button>
        <button className="bg-red-500 text-white px-6 py-2 rounded-lg">
          <a href="/home">Cancel</a>
        </button>
      </div>
    </div>
  );
}

export default CreatePost;
