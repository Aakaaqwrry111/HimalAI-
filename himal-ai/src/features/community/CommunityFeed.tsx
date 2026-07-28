import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Heart, AlertTriangle, MapPin, 
  MessageSquare, ShieldAlert, Sparkles, Filter, CheckCircle2 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../config/firebase';
import { 
  collection, addDoc, onSnapshot, query, orderBy, 
  updateDoc, doc, arrayUnion, arrayRemove, serverTimestamp 
} from 'firebase/firestore';

export interface FeedPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  isPro: boolean;
  content: string;
  category: 'Trail Condition' | 'Hazard Alert' | 'Teahouse Update' | 'General';
  location: string;
  likes: string[]; // Array of User IDs
  createdAt: any;
}

const INITIAL_MOCK_POSTS: FeedPost[] = [
  {
    id: 'mock_1',
    userId: 'usr_mock_1',
    userName: 'Pasang Sherpa',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    isPro: true,
    content: 'Fresh landslide clearance near Bamboo on the ABC route. Trail is passable, but proceed with caution due to loose gravel.',
    category: 'Hazard Alert',
    location: 'Bamboo, Annapurna Circuit',
    likes: ['usr_1', 'usr_2'],
    createdAt: new Date(Date.now() - 3600000)
  },
  {
    id: 'mock_2',
    userId: 'usr_mock_2',
    userName: 'Akarshan Subedi',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    isPro: true,
    content: 'High Camp teahouse has boosted solar Wi-Fi and solar shower heating restored today!',
    category: 'Teahouse Update',
    location: 'High Camp (3,700m)',
    likes: ['usr_1'],
    createdAt: new Date(Date.now() - 7200000)
  }
];

export default function CommunityFeed() {
  const { user, loginWithGoogle } = useAuth();
  
  const [posts, setPosts] = useState<FeedPost[]>(INITIAL_MOCK_POSTS);
  const [newPostText, setNewPostText] = useState('');
  const [locationTag, setLocationTag] = useState('');
  const [category, setCategory] = useState<FeedPost['category']>('Trail Condition');
  const [filter, setFilter] = useState<string>('All');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Subscribe to real-time Firestore updates
  useEffect(() => {
    try {
      const q = query(collection(db, 'community_feed'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const livePosts = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          })) as FeedPost[];
          
          // Combine live posts with initial mock data for a full UI experience
          setPosts([...livePosts, ...INITIAL_MOCK_POSTS]);
        }
      }, (error) => {
        console.warn('Firestore fallback active:', error);
      });

      return () => unsubscribe();
    } catch (e) {
      console.warn('Firestore offline or unconfigured, using local state mode');
    }
  }, []);

  // Handle publishing a new post
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    if (!user) {
      loginWithGoogle();
      return;
    }

    setIsSubmitting(true);

    const postPayload = {
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
      isPro: user.isPro || false,
      content: newPostText.trim(),
      category: category,
      location: locationTag.trim() || 'Himalayan Trail Wire',
      likes: [user.id],
      createdAt: serverTimestamp()
    };

    try {
      // Try writing to Firestore
      await addDoc(collection(db, 'community_feed'), postPayload);
    } catch (err) {
      // Fallback local state insertion if Firestore rules/connection are pending
      const localPost: FeedPost = {
        ...postPayload,
        id: 'local_' + Date.now(),
        createdAt: new Date()
      };
      setPosts((prev) => [localPost, ...prev]);
    } finally {
      setNewPostText('');
      setLocationTag('');
      setIsSubmitting(false);
    }
  };

  // Handle Like/Upvote Toggle
  const handleToggleLike = async (postId: string, currentLikes: string[]) => {
    if (!user) {
      loginWithGoogle();
      return;
    }

    const hasLiked = currentLikes.includes(user.id);

    // Optimistic UI update
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const updatedLikes = hasLiked
            ? post.likes.filter((id) => id !== user.id)
            : [...post.likes, user.id];
          return { ...post, likes: updatedLikes };
        }
        return post;
      })
    );

    // Sync with Firestore if it's a remote post
    if (!postId.startsWith('mock_') && !postId.startsWith('local_')) {
      try {
        const postRef = doc(db, 'community_feed', postId);
        await updateDoc(postRef, {
          likes: hasLiked ? arrayRemove(user.id) : arrayUnion(user.id)
        });
      } catch (err) {
        console.error('Failed to sync like with server:', err);
      }
    }
  };

  // Filter posts based on selected category pill
  const filteredPosts = posts.filter((post) => {
    if (filter === 'All') return true;
    return post.category === filter;
  });

  return (
    <div className="min-h-screen pt-28 pb-16 px-6 max-w-4xl mx-auto text-white">
      
      {/* Header Section */}
      <div className="mb-8 text-center md:text-left">
        <div className="inline-flex items-center gap-2 text-accent-temple-gold text-xs font-mono uppercase tracking-widest bg-accent-temple-gold/10 px-3 py-1 rounded-full border border-accent-temple-gold/20 mb-3">
          <Sparkles size={14} /> Crowdsourced Trail Intelligence
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">Community Trail Wire</h1>
        <p className="text-white/60 text-sm">Real-time hazard dispatches, teahouse status updates, and trail conditions directly from active trekkers.</p>
      </div>

      {/* Post Creation Box */}
      <div className="glass-panel bg-neutral-900/80 border border-white/10 p-6 rounded-3xl mb-10 shadow-2xl">
        {user ? (
          <form onSubmit={handleCreatePost} className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border border-accent-temple-gold object-cover" />
              <div>
                <p className="font-bold text-sm">{user.name}</p>
                <p className="text-xs text-white/50">Posting live to Trail Wire</p>
              </div>
            </div>

            <textarea
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              placeholder="Report trail conditions, weather updates, or teahouse details..."
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-accent-temple-gold transition-colors text-white placeholder-white/30 resize-none"
            />

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              
              <div className="flex items-center gap-2 flex-wrap">
                {/* Category Selection */}
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as FeedPost['category'])}
                  className="bg-neutral-800 text-xs text-white/80 border border-white/15 px-3 py-2 rounded-xl focus:outline-none"
                >
                  <option value="Trail Condition">Trail Condition</option>
                  <option value="Hazard Alert">⚠️ Hazard Alert</option>
                  <option value="Teahouse Update">🛖 Teahouse Update</option>
                  <option value="General">💬 General Dispatch</option>
                </select>

                {/* Location Tag Input */}
                <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-xs text-white/70">
                  <MapPin size={14} className="text-accent-temple-gold shrink-0" />
                  <input
                    type="text"
                    value={locationTag}
                    onChange={(e) => setLocationTag(e.target.value)}
                    placeholder="Tag Location (e.g., Deurali)"
                    className="bg-transparent focus:outline-none w-36 text-xs text-white placeholder-white/30"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !newPostText.trim()}
                className="bg-gradient-to-r from-accent-temple-gold to-orange-500 text-black font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
              >
                <Send size={14} /> Dispatch
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-6">
            <ShieldAlert size={32} className="mx-auto text-accent-temple-gold mb-3" />
            <p className="font-bold mb-1">Join the Himalayan Safety Network</p>
            <p className="text-xs text-white/60 mb-4">Log in with your Google account to post live trail alerts and upvote reports.</p>
            <button
              onClick={loginWithGoogle}
              className="bg-white text-black font-bold px-6 py-2.5 rounded-full text-xs uppercase tracking-wider hover:bg-neutral-200 transition-all"
            >
              Sign In to Post
            </button>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
        {['All', 'Hazard Alert', 'Trail Condition', 'Teahouse Update', 'General'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              filter === cat
                ? 'bg-accent-temple-gold text-black shadow-lg shadow-accent-temple-gold/10'
                : 'bg-white/5 border border-white/10 text-white/70 hover:text-white'
            }`}
          >
            {cat === 'Hazard Alert' && <AlertTriangle size={12} className={filter === cat ? 'text-black' : 'text-red-400'} />}
            {cat}
          </button>
        ))}
      </div>

      {/* Live Feed List */}
      <div className="space-y-4">
        <AnimatePresence initial={false}>
          {filteredPosts.map((post) => {
            const hasLiked = user ? post.likes.includes(user.id) : false;

            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-panel bg-neutral-900/60 border border-white/10 p-6 rounded-3xl relative hover:border-white/20 transition-all"
              >
                {/* Category Badge & Location */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1 ${
                    post.category === 'Hazard Alert'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : post.category === 'Teahouse Update'
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'bg-accent-temple-gold/20 text-accent-temple-gold border border-accent-temple-gold/30'
                  }`}>
                    {post.category === 'Hazard Alert' && <AlertTriangle size={12} />}
                    {post.category}
                  </span>

                  <span className="text-xs text-white/50 flex items-center gap-1">
                    <MapPin size={12} className="text-accent-temple-gold" /> {post.location}
                  </span>
                </div>

                {/* Content */}
                <p className="text-sm text-white/90 font-sans leading-relaxed mb-4">{post.content}</p>

                {/* Footer / User Info & Likes */}
                <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs">
                  <div className="flex items-center gap-2.5">
                    <img src={post.userAvatar} alt={post.userName} className="w-7 h-7 rounded-full object-cover border border-white/20" />
                    <div>
                      <span className="font-bold text-white/80">{post.userName}</span>
                      {post.isPro && (
                        <span className="ml-1.5 text-[9px] bg-accent-temple-gold/10 text-accent-temple-gold px-1.5 py-0.5 rounded font-mono font-bold">
                          PRO
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleLike(post.id, post.likes)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all ${
                      hasLiked
                        ? 'bg-red-500/20 border-red-500/40 text-red-400'
                        : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    <Heart size={14} className={hasLiked ? 'fill-red-500 text-red-500' : ''} />
                    <span className="font-bold">{post.likes.length}</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

    </div>
  );
}