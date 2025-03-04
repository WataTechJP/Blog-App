import { db } from "./src/firebase.js"; // `firebase.js` の場所に合わせる
import { collection, addDoc } from "firebase/firestore";

const postTestData = async () => {
  try {
    const posts = [
      {
        title: "Test Post 4",
        content: "This is a test post.",
        author: "User A",
      },
      {
        title: "Test Post 5",
        content: "Firebase Firestore is awesome!",
        author: "User B",
      },
      {
        title: "Test Post 6",
        content: "Firebase Firestore is awesome!3",
        author: "User C",
      },
    ];

    for (const post of posts) {
      await addDoc(collection(db, "posts"), {
        ...post,
        createdAt: new Date(),
      });
      console.log(`✅ 投稿成功: ${post.title}`);
    }

    console.log("🎉 すべての投稿が完了しました！");
  } catch (error) {
    console.error("❌ 投稿エラー:", error);
  }
};

// 関数を実行
postTestData();
