import React, { useEffect, useState } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchCourses } from '@/lib/database';
import type { Course } from '@/data/courses';
import CourseCard from './CourseCard';

interface FeaturedCoursesProps {
  onSelectCourse: (courseId: string) => void;
  onViewAll: () => void;
}

const FeaturedCourses: React.FC<FeaturedCoursesProps> = ({ onSelectCourse, onViewAll }) => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    const data = await fetchCourses();
    const mapped: Course[] = data
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 6)
      .map((c) => ({
        id: c.id,
        title: c.title,
        code: c.code,
        department: c.department,
        professor_name: c.professor_name,
        professor_avatar: c.professor_avatar,
        professor_id: c.professor_id,
        semester: c.semester,
        credits: c.credits,
        max_capacity: c.max_capacity,
        enrollment_count: c.enrollment_count || 0,
        description: c.description,
        image: c.image,
        level: c.level,
        rating: c.rating,
        modules: [],
        announcements: [],
      }));
    setCourses(mapped);
    setLoading(false);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">Top Rated</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-1">Featured Courses</h2>
            <p className="text-gray-600 mt-2">Discover our highest-rated courses across all departments</p>
          </div>
          <button onClick={onViewAll} className="hidden sm:flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700 transition group">
            View All Courses
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onClick={() => onSelectCourse(course.id)}
                isEnrolled={user?.enrolledCourses.includes(course.id)}
              />
            ))}
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <button onClick={onViewAll} className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700 transition">
            View All Courses
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;
