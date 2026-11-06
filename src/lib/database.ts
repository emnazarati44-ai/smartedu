import { supabase } from './supabase';

// ============ TYPES ============
export interface DbProfile {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'professor' | 'admin';
  avatar: string;
  created_at: string;
}

export interface DbCourse {
  id: string;
  title: string;
  code: string;
  department: string;
  professor_id: string | null;
  professor_name: string;
  professor_avatar: string;
  semester: string;
  credits: number;
  max_capacity: number;
  description: string;
  image: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  created_at: string;
  modules?: DbModule[];
  announcements?: DbAnnouncement[];
  enrollment_count?: number;
}

export interface DbModule {
  id: string;
  course_id: string;
  title: string;
  duration: string;
  order_index: number;
}

export interface DbAnnouncement {
  id: string;
  course_id: string;
  title: string;
  content: string;
  created_at: string;
}

export interface DbEnrollment {
  id: string;
  user_id: string;
  course_id: string;
  progress: number;
  created_at: string;
}

export interface DbDiscussion {
  id: string;
  author_id: string;
  course_id: string | null;
  title: string;
  content: string;
  tags: string[];
  likes: number;
  created_at: string;
  author?: DbProfile;
  replies?: DbReply[];
}

export interface DbReply {
  id: string;
  discussion_id: string;
  author_id: string;
  content: string;
  likes: number;
  created_at: string;
  author?: DbProfile;
}

// ============ COURSES ============
export async function fetchCourses(): Promise<DbCourse[]> {
  const { data: courses, error } = await supabase
    .from('courses')
    .select('*')
    .order('rating', { ascending: false });

  if (error) { console.error('fetchCourses error:', error); return []; }

  // Fetch enrollment counts
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('course_id');

  const countMap: Record<string, number> = {};
  (enrollments || []).forEach((e: any) => {
    countMap[e.course_id] = (countMap[e.course_id] || 0) + 1;
  });

  return (courses || []).map((c: any) => ({
    ...c,
    enrollment_count: countMap[c.id] || 0,
  }));
}

export async function fetchCourseById(courseId: string): Promise<DbCourse | null> {
  const { data: course, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', courseId)
    .single();

  if (error || !course) return null;

  const [modulesRes, announcementsRes, enrollRes] = await Promise.all([
    supabase.from('course_modules').select('*').eq('course_id', courseId).order('order_index'),
    supabase.from('announcements').select('*').eq('course_id', courseId).order('created_at', { ascending: false }),
    supabase.from('enrollments').select('id').eq('course_id', courseId),
  ]);

  return {
    ...course,
    modules: modulesRes.data || [],
    announcements: announcementsRes.data || [],
    enrollment_count: (enrollRes.data || []).length,
  };
}

export async function createCourse(course: Partial<DbCourse>, modules: { title: string; duration: string }[]): Promise<DbCourse | null> {
  const { data, error } = await supabase
    .from('courses')
    .insert([course])
    .select()
    .single();

  if (error || !data) { console.error('createCourse error:', error); return null; }

  if (modules.length > 0) {
    const moduleRows = modules.map((m, i) => ({
      course_id: data.id,
      title: m.title,
      duration: m.duration,
      order_index: i,
    }));
    await supabase.from('course_modules').insert(moduleRows);
  }

  return data;
}

export async function updateCourse(courseId: string, updates: Partial<DbCourse>): Promise<boolean> {
  const { error } = await supabase
    .from('courses')
    .update(updates)
    .eq('id', courseId);
  return !error;
}

export async function deleteCourse(courseId: string): Promise<boolean> {
  const { error } = await supabase
    .from('courses')
    .delete()
    .eq('id', courseId);
  return !error;
}

// ============ ENROLLMENTS ============
export async function fetchUserEnrollments(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('enrollments')
    .select('course_id')
    .eq('user_id', userId);

  if (error) return [];
  return (data || []).map((e: any) => e.course_id);
}

export async function enrollInCourse(userId: string, courseId: string): Promise<boolean> {
  const { error } = await supabase
    .from('enrollments')
    .insert([{ user_id: userId, course_id: courseId, progress: 0 }]);
  return !error;
}

export async function unenrollFromCourse(userId: string, courseId: string): Promise<boolean> {
  const { error } = await supabase
    .from('enrollments')
    .delete()
    .eq('user_id', userId)
    .eq('course_id', courseId);
  return !error;
}

export async function updateEnrollmentProgress(userId: string, courseId: string, progress: number): Promise<boolean> {
  const { error } = await supabase
    .from('enrollments')
    .update({ progress })
    .eq('user_id', userId)
    .eq('course_id', courseId);
  return !error;
}

// ============ DISCUSSIONS ============
export async function fetchDiscussions(): Promise<DbDiscussion[]> {
  const { data, error } = await supabase
    .from('discussions')
    .select('*, author:profiles!discussions_author_id_fkey(*)')
    .order('created_at', { ascending: false });

  if (error) { console.error('fetchDiscussions error:', error); return []; }

  const discussions = data || [];

  // Fetch replies for all discussions
  const ids = discussions.map((d: any) => d.id);
  if (ids.length === 0) return discussions;

  const { data: replies } = await supabase
    .from('discussion_replies')
    .select('*, author:profiles!discussion_replies_author_id_fkey(*)')
    .in('discussion_id', ids)
    .order('created_at');

  const replyMap: Record<string, DbReply[]> = {};
  (replies || []).forEach((r: any) => {
    if (!replyMap[r.discussion_id]) replyMap[r.discussion_id] = [];
    replyMap[r.discussion_id].push(r);
  });

  return discussions.map((d: any) => ({
    ...d,
    replies: replyMap[d.id] || [],
  }));
}

export async function createDiscussion(discussion: {
  author_id: string;
  course_id?: string;
  title: string;
  content: string;
  tags: string[];
}): Promise<DbDiscussion | null> {
  const { data, error } = await supabase
    .from('discussions')
    .insert([{ ...discussion, likes: 0 }])
    .select('*, author:profiles!discussions_author_id_fkey(*)')
    .single();

  if (error) { console.error('createDiscussion error:', error); return null; }
  return { ...data, replies: [] };
}

export async function createReply(reply: {
  discussion_id: string;
  author_id: string;
  content: string;
}): Promise<DbReply | null> {
  const { data, error } = await supabase
    .from('discussion_replies')
    .insert([{ ...reply, likes: 0 }])
    .select('*, author:profiles!discussion_replies_author_id_fkey(*)')
    .single();

  if (error) { console.error('createReply error:', error); return null; }
  return data;
}

export async function likeDiscussion(discussionId: string, currentLikes: number): Promise<boolean> {
  const { error } = await supabase
    .from('discussions')
    .update({ likes: currentLikes + 1 })
    .eq('id', discussionId);
  return !error;
}

export async function likeReply(replyId: string, currentLikes: number): Promise<boolean> {
  const { error } = await supabase
    .from('discussion_replies')
    .update({ likes: currentLikes + 1 })
    .eq('id', replyId);
  return !error;
}

// ============ PROFILES ============
export async function fetchProfile(userId: string): Promise<DbProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) return null;
  return data;
}

export async function updateProfile(userId: string, updates: Partial<DbProfile>): Promise<boolean> {
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);
  return !error;
}

// ============ ANNOUNCEMENTS ============
export async function createAnnouncement(announcement: {
  course_id: string;
  title: string;
  content: string;
}): Promise<boolean> {
  const { error } = await supabase
    .from('announcements')
    .insert([announcement]);
  return !error;
}

// ============ MODULES ============
export async function addModule(module: {
  course_id: string;
  title: string;
  duration: string;
  order_index: number;
}): Promise<boolean> {
  const { error } = await supabase
    .from('course_modules')
    .insert([module]);
  return !error;
}

export async function deleteModule(moduleId: string): Promise<boolean> {
  const { error } = await supabase
    .from('course_modules')
    .delete()
    .eq('id', moduleId);
  return !error;
}
