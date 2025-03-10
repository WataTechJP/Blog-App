import { useEffect, useState, useRef} from "react";
import { useNavigate, Link } from "react-router-dom";
import { createPortal } from "react-dom";

import { db } from "../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

import Modal from "../components/common/Modal";
import CreatePost from "./CreatePost";
import Button from "../components/common/Button";

// Import GSAP and ScrollTrigger
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

//Modal Portal
  const ModalPortal = ({children}) => {
    const target = document.querySelector('.container.create-post');
    return createPortal(children, target);  
  };

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animationsInitialized, setAnimationsInitialized] = useState(false);
  const navigate = useNavigate();

  //Define Modal State
  const [modalOpen, setModalOpen] = useState(false);

  // Refs for animations
  const sectionRefs = {
    hero: useRef(null),
    createSection: useRef(null),
    postsSection: useRef(null)
  };
  const postItemsRef = useRef([]);
  
  

  

  // Fetching posts from Firestore
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        const postsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(postsData);
        console.log("Posts fetched:", postsData.length);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
    
    // Cleanup function
    return () => {
      // Reset animation state when component unmounts
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Make sure posts are visible first, then handle animations
  useEffect(() => {
    if (loading || animationsInitialized) return;
    
    // First ensure all posts are visible
    const elements = [
      sectionRefs.hero.current,
      sectionRefs.createSection.current,
      sectionRefs.postsSection.current
    ];
    
    // Reset any potential hiding from animations
    gsap.set(elements, { clearProps: "all", opacity: 1, y: 0, scale: 1 });
    
    // Set all post items to be fully visible immediately
    if (postItemsRef.current.length > 0) {
      gsap.set(postItemsRef.current, { clearProps: "all", opacity: 1, y: 0, scale: 1 });
    }
    
    // Once we've ensured visibility, initialize animations with a delay
    const animationTimeout = setTimeout(() => {
      if (document.visibilityState === "visible") {
        initializeAnimations();
        setAnimationsInitialized(true);
      }
    }, 500); // Longer delay to ensure DOM is ready
    
    return () => {
      clearTimeout(animationTimeout);
    };
  }, [loading, posts, animationsInitialized]);
  
  // Reset post refs when posts change
  useEffect(() => {
    // Reset the refs array when posts change
    postItemsRef.current = postItemsRef.current.slice(0, posts.length);
  }, [posts]);
  
  // Separate function to initialize all animations
  const initializeAnimations = () => {
    try {
      console.log("Initializing animations, posts:", posts.length);
      
      // Only run these if the elements exist in the DOM
      if (sectionRefs.hero.current) {
        const heroTitle = sectionRefs.hero.current.querySelector("h1");
        const heroSubtitle = sectionRefs.hero.current.querySelector(".subtitle");
        
        if (heroTitle) {
          gsap.from(heroTitle, {
            opacity: 0,
            y: -30,
            duration: 1,
            ease: "power3.out",
          });
        }
        
        if (heroSubtitle) {
          gsap.from(heroSubtitle, {
            opacity: 0,
            y: 20,
            duration: 0.8,
            delay: 0.3,
            ease: "power2.out",
          });
        }
      }
      
      if (sectionRefs.createSection.current) {
        gsap.from(sectionRefs.createSection.current, {
          opacity: 0,
          y: 40,
          duration: 0.8,
          delay: 0.5,
          ease: "back.out(1.7)",
        });
      }
      
      if (sectionRefs.postsSection.current) {
        const postsTitle = sectionRefs.postsSection.current.querySelector("h2");
        const postsSubtitle = sectionRefs.postsSection.current.querySelector(".section-subtitle");
        
        if (postsTitle) {
          gsap.from(postsTitle, {
            opacity: 0,
            scale: 0.9,
            duration: 0.7,
            delay: 0.6,
            ease: "power1.out",
          });
        }
        
        if (postsSubtitle) {
          gsap.from(postsSubtitle, {
            opacity: 0,
            y: 20,
            duration: 0.5,
            delay: 0.8,
            ease: "power1.out",
          });
        }
      }
      
      // Only animate posts if there are any
      if (postItemsRef.current.length > 0) {
        console.log("Animating posts, count:", postItemsRef.current.length);
        
        // Filter out any null refs before animating
        const validPostRefs = postItemsRef.current.filter(ref => ref !== null);
        
        if (validPostRefs.length > 0) {
          gsap.from(validPostRefs, {
            opacity: 0,
            y: 30,
            duration: 0.7,
            stagger: 0.1,
            delay: 1,
            ease: "power2.out",
            onComplete: () => {
              // Ensure everything is visible when animation finishes
              gsap.set(validPostRefs, { clearProps: "all" });
            }
          });
        }
      }
      
      // See More Posts button animation
      const seeMoreBtn = sectionRefs.postsSection.current?.querySelector(".see-more-btn");
      if (seeMoreBtn) {
        gsap.from(seeMoreBtn, {
          opacity: 0,
          y: 20,
          scale: 0.9,
          duration: 0.6,
          delay: 1.2,
          ease: "back.out(1.5)",
        });
      }
    } catch (error) {
      console.error("Error initializing animations:", error);
      // Make sure everything is visible if animations fail
      makeAllVisible();
    }
  };
  
  // Fallback function to ensure visibility
  const makeAllVisible = () => {
    const elements = [
      sectionRefs.hero.current,
      sectionRefs.createSection.current,
      sectionRefs.postsSection.current,
      ...postItemsRef.current.filter(ref => ref !== null)
    ];
    
    gsap.set(elements, { clearProps: "all", opacity: 1, y: 0, scale: 1 });
  };

  const toPostList = () => navigate("/postList");

  return (
    <div className="flex flex-col items-center text-center mx-auto mt-60 min-h-screen">
      {/* Hero Section */}
      <div ref={sectionRefs.hero} className="w-full mb-12" style={{ opacity: 1 }}>
        <h1 className="text-3xl md:text-5xl xl:text-6xl font-bold my-6">
          Welcome To My Blog Channel
        </h1>
        <p className="subtitle text-lg text-white max-w-2xl mx-auto">
          Share your thoughts, memories, and moments with the world
        </p>
      </div>

      {/* Create Post Section */}
      <div 
        ref={sectionRefs.createSection} 
        className="text-black bg-gray-100 rounded-md w-full md:w-7/12 p-6 my-10"
        style={{ opacity: 1 }}
      >
        
        <div className="container create-post"></div>
         <div className="bg-white shadow-lg rounded-2xl p-6 transition-all duration-300 hover:shadow-xl">
          <h2 className="text-black text-2xl font-bold mb-4">Leave Your Current Feeling</h2>
        
          <Button onClick={() => setModalOpen(true)} disabled={modalOpen}
                    className="bg-red-500 hover:bg-red-700 text-white text-xl px-9 py-2 rounded-3xl transition-all duration-300 transform hover:scale-105 relative"> New Post Here
          </Button>
      
          {modalOpen && (
            <ModalPortal>
              <Modal handleCloseClick={() => setModalOpen(false)}>
                <CreatePost />
              </Modal>
            </ModalPortal>
          )}
        </div>
      </div>

      {/* Posts Section */}
      <div ref={sectionRefs.postsSection} className="bg-gray-100 rounded-md max-w-7xl w-full p-6 my-5">
        <h2 className="flex flex-col text-center text-black font-bold text-4xl my-3">All Posts</h2>
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h2 className="section-subtitle text-black text-2xl font-bold mb-6">See Your Precious Memories</h2>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
            </div>
          ) : (
            <>
              <div className="posts-container space-y-8">
                {posts.length > 0 ? (
                  posts.slice(0, 4).map((post, index) => (
                    <div
                      key={post.id}
                      ref={(el) => (postItemsRef.current[index] = el)}
                      className="p-5 border border-gray-200 rounded-lg shadow-sm text-black transition-all duration-300 hover:shadow-md hover:border-gray-300"
                    >
                      <h2 className="text-xl font-bold">{post.title}</h2>
                      <p className="text-gray-500 text-sm mt-1">
                        {post.createdAt ? new Date(post.createdAt.seconds * 1000).toLocaleString() : "Unknown"}
                      </p>

                      {post.imageUrl && (
                        <div className="mt-4">
                          <div className="w-full max-w-lg mx-auto overflow-hidden rounded-lg">
                            <img 
                              src={post.imageUrl} 
                              alt={post.title} 
                              className="w-full h-48 object-cover transition-transform duration-500 hover:scale-105"
                            />
                          </div>
                        </div>
                      )}

                      <p className="mt-3 text-gray-700">
                        {post.content && typeof post.content === 'string' 
                          ? post.content.split("\n").slice(0, 2).join("\n") + "..." 
                          : "No content available"}
                      </p>

                      <Link 
                        to={`/show/${post.id}`} 
                        className="inline-block mt-4 px-4 py-2 text-blue-500 border border-blue-500 rounded-md hover:bg-blue-500 hover:text-white transition-colors duration-300"
                      >
                        Read More
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No posts found. Create your first post!
                  </div>
                )}
              </div>

              {posts.length > 0 && (
                <div className="mt-10 text-center">
                  <Button 
                    onClick={toPostList} 
                    className="see-more-btn bg-red-500 hover:bg-red-700 text-white px-8 py-3 rounded-lg focus:outline-none transition-all duration-300 hover:shadow-lg"
                  >
                    See More Posts
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
