import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { fetchProfile, fetchUserEnrollments, updateProfile, enrollInCourse as dbEnroll, unenrollFromCourse as dbUnenroll } from '@/lib/database';
import type { Session } from '@supabase/supabase-js';

export type UserRole = 'student' | 'professor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  subject?: string;
  enrolledCourses: string[];
  joinDate: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string, role: UserRole, subject?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  enrollInCourse: (courseId: string) => Promise<void>;
  unenrollFromCourse: (courseId: string) => Promise<void>;
  refreshEnrollments: () => Promise<void>;
  updateUserAvatar: (avatarUrl: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const roleAvatars: Record<UserRole, string> = {
  student: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop',
  professor: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
  admin: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop',
};

async function buildUser(session: Session): Promise<User> {
  const supaUser = session.user;
  const meta = supaUser.user_metadata || {};

  // Try to fetch profile from DB
  let profile: any = null;
  try {
    profile = await fetchProfile(supaUser.id);
  } catch (e) {
    console.warn('Could not fetch profile, using metadata fallback');
  }

  // Fetch enrollments
  let enrollments: string[] = [];
  try {
    enrollments = await fetchUserEnrollments(supaUser.id);
  } catch (e) {
    console.warn('Could not fetch enrollments');
  }

  // =============================================
  // CRITICAL FIX: metadata.role is AUTHORITATIVE
  // =============================================
  // The Supabase DB trigger auto-creates a profile with role='student' on signup.
  // That means profile.role is ALWAYS 'student' initially, regardless of what
  // the user chose. The user's actual chosen role lives in user_metadata.role,
  // which is set during signUp(). So we MUST check metadata FIRST.
  //
  // Priority: meta.role > profile.role > fallback 'student'
  const metaRole = meta.role as UserRole | undefined;
  const profileRole = profile?.role as UserRole | undefined;

  let role: UserRole;
  if (metaRole && metaRole !== 'student') {
    // User explicitly chose professor or admin at signup — trust it
    role = metaRole;
  } else if (metaRole === 'student') {
    // User explicitly chose student — trust it
    role = 'student';
  } else if (profileRole) {
    // No metadata role (shouldn't happen), fall back to profile
    role = profileRole;
  } else {
    role = 'student';
  }

  // If the profile exists but has the wrong role, sync it
  if (profile && profile.role !== role) {
    try {
      await updateProfile(supaUser.id, { role, name: meta.name || profile.name, avatar: meta.avatar || profile.avatar || roleAvatars[role] });
    } catch (e) {
      console.warn('Could not sync profile role');
    }
  }

  const name = meta.name || profile?.name || 'User';
  // For avatar: use profile avatar if user has customized it, otherwise use metadata or default
  const avatar = profile?.avatar || meta.avatar || roleAvatars[role];

  return {
    id: supaUser.id,
    name,
    email: supaUser.email || '',
    role,
    avatar,
    subject: meta.subject || '',
    enrolledCourses: enrollments,
    joinDate: profile?.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
  };
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        const u = await buildUser(session);
        setUser(u);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const u = await buildUser(session);
        setUser(u);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { success: false, error: error.message };

      if (data.session) {
        const u = await buildUser(data.session);
        setUser(u);
      }

      return { success: true };
    } catch (err) {
      return { success: false, error: 'Login failed' };
    }
  };

  const signup = async (name: string, email: string, password: string, role: UserRole, subject?: string) => {
    try {
      const chosenAvatar = roleAvatars[role];
      const metadata: Record<string, any> = {
        name,
        role,
        avatar: chosenAvatar,
      };
      if (role === 'professor' && subject) {
        metadata.subject = subject;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: metadata },
      });

      if (error) return { success: false, error: error.message };

      const userId = data.user?.id;

      // =============================================
      // CRITICAL: Force-update the profiles table
      // =============================================
      // The DB trigger will have already created a row with role='student'.
      // We need to overwrite it with the actual chosen role.
      if (userId) {
        // Small delay to let the trigger finish creating the profile row
        await new Promise((resolve) => setTimeout(resolve, 500));

        try {
          await updateProfile(userId, {
            role,
            name,
            avatar: chosenAvatar,
          });
        } catch (e) {
          console.warn('Could not update profile after signup:', e);
          // Even if this fails, the metadata approach in buildUser will still work
        }
      }

      // Build user — now metadata will be used as the authoritative source
      if (data.session) {
        const u = await buildUser(data.session);
        setUser(u);
      } else if (data.user) {
        // No session yet (email confirmation required?) — set from what we know
        setUser({
          id: data.user.id,
          name,
          email: data.user.email || email,
          role,
          avatar: chosenAvatar,
          subject: subject || '',
          enrolledCourses: [],
          joinDate: new Date().toISOString().split('T')[0],
        });
      }

      return { success: true };
    } catch {
      return { success: false, error: 'Signup failed' };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const enrollInCourse = async (courseId: string) => {
    if (!user) return;
    const success = await dbEnroll(user.id, courseId);
    if (success) {
      setUser((prev) => prev ? { ...prev, enrolledCourses: [...prev.enrolledCourses, courseId] } : null);
    }
  };

  const unenrollFromCourse = async (courseId: string) => {
    if (!user) return;
    const success = await dbUnenroll(user.id, courseId);
    if (success) {
      setUser((prev) => prev ? { ...prev, enrolledCourses: prev.enrolledCourses.filter((id) => id !== courseId) } : null);
    }
  };

  const refreshEnrollments = useCallback(async () => {
    if (!user) return;
    const enrollments = await fetchUserEnrollments(user.id);
    setUser((prev) => prev ? { ...prev, enrolledCourses: enrollments } : null);
  }, [user]);

  const updateUserAvatar = async (avatarUrl: string): Promise<boolean> => {
    if (!user) return false;

    // Update in profiles table
    const dbSuccess = await updateProfile(user.id, { avatar: avatarUrl });

    // Also update in auth metadata so it persists across sessions
    const { error } = await supabase.auth.updateUser({
      data: { avatar: avatarUrl },
    });

    if (dbSuccess || !error) {
      setUser((prev) => prev ? { ...prev, avatar: avatarUrl } : null);
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        signup,
        logout,
        enrollInCourse,
        unenrollFromCourse,
        refreshEnrollments,
        updateUserAvatar,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
