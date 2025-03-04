import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";

const POSTS_PER_PAGE = 10; // 1ページに表示する投稿数

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            const querySnapshot = await getDocs(collection(db, "posts"));
            const sortedPosts = querySnapshot.docs
                .map((doc) => ({ id: doc.id, ...doc.data() }))
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // 降順ソート（新しい投稿が上）

            setPosts(sortedPosts);
        };

        fetchPosts();
    }, []);

    // 投稿の削除処理
    const deletePost = async (postId) => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            await deleteDoc(doc(db, "posts", postId));
            setPosts(posts.filter((post) => post.id !== postId));
        }
    };

    // 現在のページに表示する投稿を取得
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const selectedPosts = posts.slice(startIndex, startIndex + POSTS_PER_PAGE);
    const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

    // トップへ戻る
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="flex flex-col items-center max-w-3xl mx-auto mt-10 min-h-screen w-full">
            <div className="text-4xl font-bold my-5">
                <h1>Post List</h1>
            </div>

            {/* 投稿がない場合の表示 */}
            {selectedPosts.length === 0 ? (
                <p className="text-gray-500">No posts available.</p>
            ) : (
                selectedPosts.map((post, index) => (
                    <div key={post.id} className="bg-gray-100 rounded-md w-full p-6 my-2 shadow-lg">
                        <div className="text-black p-6">
                            <div className="flex text-center mb-2">
                                <h1 className="text-lg font-semibold">#{posts.length - startIndex - index} - {post.title}</h1>
                            </div>

                            <div className="mb-6 p-4 border rounded shadow-sm">
                                <label className="block font-medium">Title:</label>
                                <h2 className="text-xl font-bold">{post.title}</h2>

                                {post.imageUrl && (
                                    <>
                                        <label className="block font-medium mt-2">Image:</label>
                                        <div>
                                            <img src={post.imageUrl} alt={post.title} className="w-full h-auto rounded-lg shadow" />
                                        </div>
                                    </>
                                )}

                                <label className="block font-medium mt-2">Date posted:</label>
                                <p className="text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>

                                <label className="block font-medium mt-2">Content:</label>
                                <p className="text-gray-700">{post.content}</p>

                                <div className="flex justify-between mt-4">
                                    <Link to={`/show/${post.id}`} className="text-blue-500 underline">
                                        Read More
                                    </Link>

                                    {/* 削除ボタン */}
                                    <button
                                        onClick={() => deletePost(post.id)}
                                        className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}

            <div className="mt-6 flex items-center space-x-4">
                <span className="px-4 py-2 bg-blue-600 rounded">
                    Page {currentPage} of {totalPages}
                </span>

                {totalPages > 1 && (
                    <>
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className={`px-4 py-2 rounded ${currentPage === 1 ? "bg-gray-300" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
                        >
                            Previous
                        </button>

                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className={`px-4 py-2 rounded ${currentPage === totalPages ? "bg-gray-300" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
                        >
                            Next
                        </button>
                    </>
                )}
            </div>

            <button
                onClick={scrollToTop}
                className="fixed bottom-6 right-6 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-600 transition-transform duration-300 ease-in-out hover:-translate-y-1"
            >
                ↑ Top
            </button>
        </div>
    );
};

export default PostList;