import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Heart, Share2, MapPin, Send, Plus, Flame, X, Camera } from 'lucide-react';

interface Post {
  id: string;
  author: string;
  role: string;
  location: string;
  timestamp: string;
  content: string;
  tag: 'Trail Update' | 'Teahouse Review' | 'Safety Alert' | 'Experience';
  likes: number;
  commentsCount: number;
  hazard?: boolean;
  imageUrl?: string;
}

// 5 Rich, Authentic Nepali Trekking Experiences
const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    author: 'Akarshan',
    role: 'Explorer Pathfinder',
    location: 'Mardi Himal High Camp (3,580m)',
    timestamp: '2 hours ago',
    content: 'Woke up at 3:30 AM to push for the viewpoint. The way the morning sun hits Mount Machhapuchhre (Fishtail) makes every freezing step worth it. The trail is well-marked, but highly recommend crampons for the last 45 minutes as the black ice is very slippery right now. Dal Bhat at High Camp hits different after a 6-hour hike!',
    tag: 'Experience',
    likes: 142,
    commentsCount: 18,
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: '2',
    author: 'Sarah Jenkins',
    role: 'Solo Trekker',
    location: 'Gokyo Ri (5,357m)',
    timestamp: '5 hours ago',
    content: 'Just completed the Cho La Pass! It was grueling, but seeing the third Gokyo Lake from above is a spiritual experience. For anyone heading this way tomorrow: the rockfall zone near Dzongla is active due to the afternoon wind. Cross it before 11 AM.',
    tag: 'Trail Update',
    likes: 89,
    commentsCount: 12,
    imageUrl: 'https://images.unsplash.com/photo-1533604100650-7dc5e29bc353?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: '3',
    author: 'Pasang Dorje',
    role: 'Certified Guide',
    location: 'Thorong La Pass (5,416m)',
    timestamp: '1 day ago',
    content: 'Heavy snowfall reported on the Annapurna Circuit approach to Thorong La. We are holding our group at Thorong Phedi for an extra acclimatization day. Do not attempt the pass if you do not have a guide or proper deep-snow gaiters. Safety first, the mountains aren\'t going anywhere.',
    tag: 'Safety Alert',
    likes: 215,
    commentsCount: 34,
    hazard: true
  },
  {
    id: '4',
    author: 'Dr. Arjun Thapa',
    role: 'Medical Volunteer',
    location: 'Kyanjin Gompa, Langtang (3,870m)',
    timestamp: '1 day ago',
    content: 'The resilience of the Langtang valley never ceases to amaze me. Spent the afternoon at the local cheese factory and visiting the monastery. If you are staying here, visit the Dorje Bakery—best yak cheese apple pie in the Himalayas. The community here has rebuilt so beautifully.',
    tag: 'Teahouse Review',
    likes: 310,
    commentsCount: 22,
    imageUrl: 'https://images.unsplash.com/photo-1626082929543-5b8cb4604473?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: '5',
    author: 'Elena Rostova',
    role: 'Photographer',
    location: 'Manaslu Circuit - Samagaon',
    timestamp: '2 days ago',
    content: 'Far fewer crowds here than Everest or Annapurna. Just you, the roar of the Budhi Gandaki river, and ancient suspension bridges strung with prayer flags. The wind is fierce today. Make sure your permits for the restricted area are stamped at the previous checkpoint, they are checking strictly here!',
    tag: 'Experience',
    likes: 176,
    commentsCount: 15,
    imageUrl: 'https://images.unsplash.com/photo-1502027587841-f5139a099a9a?q=80&w=1000&auto=format&fit=crop'
  }
];

export default function CommunityFeed() {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [isPosting, setIsPosting] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Form State
  const [newContent, setNewContent] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newTag, setNewTag] = useState<Post['tag']>('Experience');

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim() || !newLocation.trim()) return;

    const newPost: Post = {
      id: Date.now().toString(),
      author: 'Akarshan', 
      role: 'Explorer Pathfinder',
      location: newLocation,
      timestamp: 'Just now',
      content: newContent,
      tag: newTag,
      likes: 0,
      commentsCount: 0,
      hazard: newTag === 'Safety Alert'
    };

    setPosts([newPost, ...posts]);
    setNewContent('');
    setNewLocation('');
    setIsPosting(false);
  };

  const filteredPosts = activeFilter === 'All' 
    ? posts 
    : activeFilter === 'Safety' 
      ? posts.filter(p => p.hazard || p.tag === 'Safety Alert')
      : posts.filter(p => p.tag === activeFilter);

  return (
    <div className="min-h-screen pt-28 pb-16 px-6 max-w-3xl mx-auto text-white relative">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-accent-temple-gold mb-1 font-mono text-xs uppercase tracking-widest">
            <Flame size={14} /> Himalayan Live Wire
          </div>
          <h1 className="text-4xl font-display font-bold">Community Basecamp</h1>
        </div>
        <button 
          onClick={() => setIsPosting(!isPosting)}
          className="bg-gradient-to-r from-accent-temple-gold to-orange-500 text-black font-bold px-5 py-2.5 rounded-full flex items-center gap-2 shadow-lg shadow-accent-temple-gold/20 hover:scale-105 transition-all"
        >
          <Plus size={18} /> Share Journey
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 custom-scrollbar">
        {['All', 'Experience', 'Safety Alert', 'Trail Update', 'Teahouse Review'].map(filter => (
          <button 
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
              activeFilter === filter 
                ? 'bg-accent-temple-gold text-black' 
                : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Feed List */}
      <div className="space-y-6">
        {filteredPosts.map((post, idx) => (
          <motion.div 
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => setSelectedPost(post)}
            className={`glass-panel bg-black/40 border p-0 rounded-3xl overflow-hidden cursor-pointer group transition-all ${
              post.hazard ? 'border-red-500/40 hover:border-red-500/80' : 'border-white/10 hover:border-white/30'
            }`}
          >
            {/* If post has an image, render it at the top */}
            {post.imageUrl && (
              <div className="w-full h-56 overflow-hidden relative">
                <img 
                  src={post.imageUrl} 
                  alt={post.location} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              </div>
            )}

            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-accent-temple-gold to-orange-600 flex items-center justify-center font-bold text-black text-sm shadow">
                    {post.author.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white flex items-center gap-2">
                      {post.author}
                    </h4>
                    <p className="text-xs text-white/40 flex items-center gap-1 mt-0.5">
                      <MapPin size={12} className="text-accent-temple-gold" /> {post.location} • {post.timestamp}
                    </p>
                  </div>
                </div>
                <span className={`text-[10px] font-mono px-3 py-1 rounded-full border uppercase ${
                  post.tag === 'Safety Alert' ? 'bg-red-500/20 border-red-500/40 text-red-400 font-bold' : 'bg-white/5 border-white/10 text-white/60'
                }`}>
                  {post.tag}
                </span>
              </div>

              {/* Truncated text for the feed view */}
              <p className="text-white/80 text-sm leading-relaxed mb-4 line-clamp-3">
                {post.content}
              </p>

              <div className="flex items-center gap-6 pt-4 border-t border-white/10 text-xs text-white/50">
                <span className="flex items-center gap-1.5 hover:text-accent-temple-gold transition-colors"><Heart size={16} /> {post.likes}</span>
                <span className="flex items-center gap-1.5 hover:text-accent-temple-gold transition-colors"><MessageSquare size={16} /> {post.commentsCount}</span>
                <span className="ml-auto text-accent-temple-gold font-medium group-hover:underline">Read Full Story &rarr;</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Expanded Post Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedPost(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-neutral-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <button 
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 z-10 w-8 h-8 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white/70 hover:text-white border border-white/10"
              >
                <X size={16} />
              </button>

              {selectedPost.imageUrl && (
                <img src={selectedPost.imageUrl} alt={selectedPost.location} className="w-full h-72 md:h-96 object-cover" />
              )}
              
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-accent-temple-gold to-orange-600 flex items-center justify-center font-bold text-black text-lg">
                    {selectedPost.author.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-white">{selectedPost.author}</h4>
                    <p className="text-sm text-accent-temple-gold flex items-center gap-1">
                      <MapPin size={14} /> {selectedPost.location}
                    </p>
                  </div>
                </div>

                <p className="text-white/90 text-base md:text-lg leading-relaxed mb-8 font-light">
                  {selectedPost.content}
                </p>

                <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                  <button className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
                    <Heart size={18} /> Like
                  </button>
                  <button className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
                    <MessageSquare size={18} /> Comment
                  </button>
                  <button className="px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors">
                    <Share2 size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}