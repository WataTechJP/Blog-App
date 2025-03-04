import { db } from "./src/firebase.js";
import { collection, getDocs } from "firebase/firestore";

const fetchPosts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "posts"));
    const posts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("📌 Firestore から取得した投稿:", posts);
  } catch (error) {
    console.error("❌ データ取得エラー:", error);
  }
};

// 関数を実行
fetchPosts();
