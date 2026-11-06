import React, { useState, useEffect, useCallback } from 'react';
import { MessageSquare, ThumbsUp, Send, Plus, X, Search, Filter, Loader2, RefreshCw, FileText, Upload, Lock, Users2, Sparkles, Shield, BookOpen } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchDiscussions, createDiscussion, createReply, likeDiscussion, likeReply } from '@/lib/database';
import type { DbDiscussion } from '@/lib/database';
import { supabase } from '@/lib/supabase';

const roleBadge: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  student: { bg: 'bg-blue-100', text: 'text-blue-700', icon: null },
  professor: { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: <BookOpen className="w-3 h-3" /> },
  admin: { bg: 'bg-purple-100', text: 'text-purple-700', icon: <Shield className="w-3 h-3" /> },
};

const Discussion: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [discussions, setDiscussions] = useState<DbDiscussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterTag, setFilterTag] = useState('All');
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [showNewPost, setShowNewPost] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('');
  const [attachmentName, setAttachmentName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canCreateCommunity = isAuthenticated && user && (user.role === 'professor' || user.role === 'admin');
  const canUploadFiles = canCreateCommunity;

  const loadDiscussions = useCallback(async () => {
    setLoading(true);
    const data = await fetchDiscussions();
    setDiscussions(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadDiscussions();
  }, [loadDiscussions]);

  // Real-time subscription for discussions
  useEffect(() => {
    const channel = supabase
      .channel('discussions-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'discussions' }, () => {
        loadDiscussions();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'discussion_replies' }, () => {
        loadDiscussions();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadDiscussions]);

  const allTags = ['All', ...Array.from(new Set(discussions.flatMap((d) => d.tags || [])))];

  const filtered = discussions.filter((d) => {
    const matchSearch = !search || d.title.toLowerCase().includes(search.toLowerCase()) || d.content.toLowerCase().includes(search.toLowerCase());
    const matchTag = filterTag === 'All' || (d.tags || []).includes(filterTag);
    return matchSearch && matchTag;
  });

  const handleLike = async (postId: string) => {
    const post = discussions.find((d) => d.id === postId);
    if (!post) return;
    const success = await likeDiscussion(postId, post.likes);
    if (success) {
      setDiscussions((prev) => prev.map((d) => d.id === postId ? { ...d, likes: d.likes + 1 } : d));
    }
  };

  const handleReplyLike = async (postId: string, replyId: string) => {
    const post = discussions.find((d) => d.id === postId);
    const reply = post?.replies?.find((r) => r.id === replyId);
    if (!reply) return;
    const success = await likeReply(replyId, reply.likes);
    if (success) {
      setDiscussions((prev) =>
        prev.map((d) => d.id === postId ? { ...d, replies: (d.replies || []).map((r) => r.id === replyId ? { ...r, likes: r.likes + 1 } : r) } : d)
      );
    }
  };

  const handleReply = async (postId: string) => {
    if (!user || !replyText[postId]?.trim()) return;
    setSubmitting(true);
    const newReply = await createReply({
      discussion_id: postId,
      author_id: user.id,
      content: replyText[postId],
    });
    if (newReply) {
      setDiscussions((prev) =>
        prev.map((d) => d.id === postId ? { ...d, replies: [...(d.replies || []), newReply] } : d)
      );
      setReplyText((prev) => ({ ...prev, [postId]: '' }));
    }
    setSubmitting(false);
  };

  const handleNewPost = async () => {
    if (!user || !newTitle.trim() || !newContent.trim()) return;
    if (!canCreateCommunity) return;
    setSubmitting(true);

    let content = newContent;
    if (attachmentName && canUploadFiles) {
      content += `\n\n📎 Attachment: ${attachmentName}`;
    }

    const post = await createDiscussion({
      author_id: user.id,
      title: newTitle,
      content,
      tags: newTags.split(',').map((t) => t.trim()).filter(Boolean),
    });
    if (post) {
      setDiscussions((prev) => [post, ...prev]);
      setNewTitle('');
      setNewContent('');
      setNewTags('');
      setAttachmentName('');
      setShowNewPost(false);
    }
    setSubmitting(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canUploadFiles) return;
    const file = e.target.files?.[0];
    if (file) {
      setAttachmentName(file.name);
    }
  };

  const formatTime = (ts: string) => {
    const d = new Date(ts);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getRoleBadge = (role: string) => {
    const badge = roleBadge[role] || roleBadge.student;
    return (
      <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${badge.bg} ${badge.text}`}>
        {badge.icon}
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  return (
    <section className="py-8 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <Users2 className="w-5 h-5 text-white" />
              </div>
              Communities
            </h1>
            <p className="text-gray-600">Connect with students, professors, and staff</p>
          </div>
          <div className="flex gap-2">
            <button onClick={loadDiscussions} className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition bg-white shadow-sm">
              <RefreshCw className="w-4 h-4" />Refresh
            </button>
            {canCreateCommunity ? (
              <button onClick={() => setShowNewPost(true)} className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition shadow-lg shadow-indigo-200">
                <Plus className="w-4 h-4" />New Community Post
              </button>
            ) : isAuthenticated ? (
              <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 rounded-xl text-sm text-gray-500">
                <Lock className="w-4 h-4" />
                <span>Only professors & admins can create posts</span>
              </div>
            ) : null}
          </div>
        </div>

        {/* Info banner for students */}
        {isAuthenticated && user?.role === 'student' && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <MessageSquare className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-800">Welcome to Communities!</p>
              <p className="text-xs text-blue-600 mt-0.5">You can browse discussions, reply to posts, and like content. Community posts and file uploads are managed by professors and administrators.</p>
            </div>
          </div>
        )}

        {/* Search & Filter */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search discussions..." className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition" />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
              {allTags.slice(0, 8).map((tag) => (
                <button key={tag} onClick={() => setFilterTag(tag)} className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full font-medium transition ${filterTag === tag ? 'bg-indigo-100 text-indigo-700 shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* New Post Modal */}
        {showNewPost && canCreateCommunity && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowNewPost(false)} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 text-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Create Community Post
                  </h2>
                  <button onClick={() => setShowNewPost(false)} className="p-1 rounded-full hover:bg-white/20 transition"><X className="w-5 h-5" /></button>
                </div>
                <p className="text-white/70 text-xs mt-1">Share knowledge, resources, or start a discussion</p>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Give your post a clear title..." className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                  <textarea value={newContent} onChange={(e) => setNewContent(e.target.value)} placeholder="Write your post content..." rows={4} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                  <input type="text" value={newTags} onChange={(e) => setNewTags(e.target.value)} placeholder="e.g. Python, Machine Learning, Homework" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
                </div>

                {/* File upload - only for professors/admins */}
                {canUploadFiles && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <span className="flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-indigo-500" />
                        Attach File (optional)
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="discussion-file-upload"
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip,.png,.jpg"
                      />
                      <label
                        htmlFor="discussion-file-upload"
                        className={`flex items-center gap-3 w-full px-4 py-3 border-2 border-dashed rounded-xl cursor-pointer transition ${
                          attachmentName ? 'border-emerald-300 bg-emerald-50' : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/30'
                        }`}
                      >
                        <Upload className={`w-5 h-5 ${attachmentName ? 'text-emerald-500' : 'text-gray-400'}`} />
                        <div className="flex-1 min-w-0">
                          {attachmentName ? (
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-emerald-700 truncate">{attachmentName}</span>
                              <button
                                type="button"
                                onClick={(e) => { e.preventDefault(); setAttachmentName(''); }}
                                className="text-xs text-red-500 hover:text-red-700 font-medium"
                              >
                                Remove
                              </button>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">Click to upload a file (PDF, DOC, images, etc.)</span>
                          )}
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                <button onClick={handleNewPost} disabled={!newTitle.trim() || !newContent.trim() || submitting} className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-200">
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <Sparkles className="w-4 h-4" />
                  Publish Post
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Discussion List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            <p className="text-sm text-gray-500">Loading discussions...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-sm">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-1">No discussions found</h3>
                <p className="text-gray-500 text-sm">
                  {canCreateCommunity ? 'Start a new discussion to get the conversation going!' : 'Check back later for new posts from professors and admins.'}
                </p>
              </div>
            ) : (
              filtered.map((post) => (
                <div key={post.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 shadow-sm">
                  <div className="p-5">
                    {/* Post Header */}
                    <div className="flex items-start gap-3 mb-3">
                      <img src={post.author?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop'} alt={post.author?.name || ''} className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-gray-900">{post.author?.name || 'Unknown'}</span>
                          {getRoleBadge(post.author?.role || 'student')}
                        </div>
                        <span className="text-xs text-gray-400">{formatTime(post.created_at)}</span>
                      </div>
                    </div>

                    {/* Post Content */}
                    <h3 className="text-base font-semibold text-gray-900 mb-2">{post.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-3 whitespace-pre-wrap">{post.content}</p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {(post.tags || []).map((tag) => (
                        <span key={tag} className="text-xs bg-indigo-50 text-indigo-600 px-2.5 py-0.5 rounded-lg font-medium">{tag}</span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
                      <button onClick={() => handleLike(post.id)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition group">
                        <ThumbsUp className="w-4 h-4 group-hover:scale-110 transition" />
                        <span className="font-medium">{post.likes}</span>
                      </button>
                      <button onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition group">
                        <MessageSquare className="w-4 h-4 group-hover:scale-110 transition" />
                        <span className="font-medium">{(post.replies || []).length} {(post.replies || []).length === 1 ? 'reply' : 'replies'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Replies */}
                  {expandedPost === post.id && (
                    <div className="border-t border-gray-100 bg-gradient-to-b from-gray-50 to-white p-5 space-y-4">
                      {(post.replies || []).map((reply) => (
                        <div key={reply.id} className="flex gap-3">
                          <img src={reply.author?.avatar || ''} alt={reply.author?.name || ''} className="w-8 h-8 rounded-full object-cover flex-shrink-0 ring-2 ring-gray-100" />
                          <div className="flex-1 bg-white rounded-xl p-3 border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="text-sm font-semibold text-gray-900">{reply.author?.name || 'Unknown'}</span>
                              {getRoleBadge(reply.author?.role || 'student')}
                              <span className="text-xs text-gray-400">{formatTime(reply.created_at)}</span>
                            </div>
                            <p className="text-sm text-gray-600">{reply.content}</p>
                            <button onClick={() => handleReplyLike(post.id, reply.id)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-indigo-600 mt-2 transition">
                              <ThumbsUp className="w-3 h-3" />{reply.likes}
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Reply input - all authenticated users can reply */}
                      {isAuthenticated ? (
                        <div className="flex gap-3">
                          <img src={user?.avatar || ''} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0 ring-2 ring-gray-100" />
                          <div className="flex-1 flex gap-2">
                            <input
                              type="text"
                              value={replyText[post.id] || ''}
                              onChange={(e) => setReplyText((prev) => ({ ...prev, [post.id]: e.target.value }))}
                              onKeyDown={(e) => e.key === 'Enter' && handleReply(post.id)}
                              placeholder="Write a reply..."
                              className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
                            />
                            <button onClick={() => handleReply(post.id)} disabled={!replyText[post.id]?.trim() || submitting} className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50 shadow-sm">
                              <Send className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 text-center py-3 bg-white rounded-xl border border-gray-200">Sign in to reply</p>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Discussion;
