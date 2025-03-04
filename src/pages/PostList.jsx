import { useEffect, useState, useRef } from "react";
import { db, storage } from "../firebase";
import { collection, getDocs, doc, deleteDoc, query, orderBy } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "../components/common/Button";

const POSTS_PER_PAGE = 10;

export const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true); 
    const [currentPage, setCurrentPage] = useState(1);
    const toastDisplayed = useRef(false); 
    const navigate = useNavigate();

    useEffect(() => {
        if (!toastDisplayed.current) { 
            toast.info("Data fetching now...", { autoClose: 2000 });
            toastDisplayed.current = true;
        }

        const fetchPosts = async () => {
            const q = query(collection(db, "posts"), orderBy("createdAt", "desc")); // Firestore で並び替え
            const querySnapshot = await getDocs(q);

            
            setPosts(querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })));

            setTimeout(() => {
                setLoading(false);
                if (fetchedPosts.length === 0) {
                    toast.warn("No posts available.", { autoClose: 3000 });
                } else {
                    toast.success("Posts fetched successfully!", { autoClose: 3000 });
                }
            }, 2000);
        };

        fetchPosts();
    }, []);

    const deletePost = async (postId, imageUrl) => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            try {
                await deleteDoc(doc(db, "posts", postId));
                setPosts(posts.filter((post) => post.id !== postId));

                if (imageUrl) {
                    const imageRef = ref(storage, imageUrl);
                    await deleteObject(imageRef);
                    toast.success("Posts deleted successfully!", { autoClose: 3000 });
                }
            } catch (error) {
                console.error("Error deleting post:", error);
                toast.warn("Failed to delete post.", { autoClose: 3000 });
            }
        }
    };

    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const selectedPosts = posts.slice(startIndex, startIndex + POSTS_PER_PAGE);
    const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="flex flex-col items-center max-w-3xl mx-auto mt-10 min-h-screen w-full">
            <div className="text-4xl font-bold my-5">
                <h1>Post List</h1>
            </div>

            {loading ? (
                <p className="text-red-500 text-lg">⏳ Data fetching now...</p>
            ) : selectedPosts.length === 0 ? (
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
                                <p className="text-gray-500">
                                    {post.createdAt ? new Date(post.createdAt.seconds * 1000).toLocaleString() : "Unknown"}
                                </p>

                                <label className="block font-medium mt-2">Content:</label>
                                <p className="text-gray-700">{post.content}</p>

                                <div className="flex justify-between mt-4">
                                    <Link to={`/show/${post.id}`} className="text-blue-500 hover:text-blue-800 font-semibold underline">
                                        More Details
                                    </Link>

                                    <Button onClick={() => deletePost(post.id, post.imageUrl)}
                                        className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-700">
                                            Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                ))
            )}

            {totalPages > 1 && (
                <div className="mt-6 text-center">
                    <div className="flex justify-center items-center mb-4">
                        <span className="px-4 py-2 bg-blue-600 text-white rounded text-lg font-semibold">
                            Page {currentPage} of {totalPages}
                        </span>
                    </div>

                    <div className="flex space-x-5 justify-center">
                        <Button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className={`px-6 py-3 rounded-lg text-lg font-semibold transition-all duration-300 ${
                                currentPage === 1 
                                    ? "bg-gray-300 text-gray-600 cursor-not-allowed opacity-50" 
                                    : "bg-blue-500 hover:bg-blue-700 text-white"
                            }`}
                        >
                            ← Previous
                        </Button>

                        <Button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className={`px-6 py-3 rounded-lg text-lg font-semibold transition-all duration-300 ${
                                currentPage === totalPages 
                                    ? "bg-gray-300 text-gray-600 cursor-not-allowed opacity-50" 
                                    : "bg-blue-500 hover:bg-blue-700 text-white"
                            }`}
                        >
                            Next →
                        </Button>
                    </div>
                </div>
            )}

            <Button onClick={scrollToTop} className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow-lg">
                ↑ Top
            </Button>
        </div>
    );
};

export default PostList;