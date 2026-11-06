import React from 'react';
import { Star, Users, Clock, BookOpen } from 'lucide-react';
import type { Course } from '@/data/courses';

interface CourseCardProps {
  course: Course;
  onClick: () => void;
  isEnrolled?: boolean;
  progress?: number;
}

const levelColors: Record<string, string> = {
  Beginner: 'bg-green-100 text-green-700',
  Intermediate: 'bg-yellow-100 text-yellow-700',
  Advanced: 'bg-red-100 text-red-700',
};

const CourseCard: React.FC<CourseCardProps> = ({ course, onClick, isEnrolled, progress = 0 }) => {
  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-indigo-200 transition-all duration-300 cursor-pointer hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${levelColors[course.level]}`}>
            {course.level}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/90 text-gray-700">
            {course.code}
          </span>
        </div>
        {isEnrolled && (
          <div className="absolute bottom-3 left-3 right-3">
            <div className="flex justify-between text-xs text-white mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-white/30 rounded-full h-1.5">
              <div
                className="bg-gradient-to-r from-blue-400 to-indigo-400 h-1.5 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-indigo-600 font-medium bg-indigo-50 px-2 py-0.5 rounded">
            {course.department}
          </span>
          <span className="text-xs text-gray-400">{course.semester}</span>
        </div>

        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
          {course.title}
        </h3>

        <p className="text-sm text-gray-500 line-clamp-2 mb-4">{course.description}</p>

        {/* Professor */}
        <div className="flex items-center gap-2 mb-4">
          <img src={course.professor_avatar} alt={course.professor_name} className="w-7 h-7 rounded-full object-cover" />
          <span className="text-sm text-gray-600">{course.professor_name}</span>
        </div>

        {/* Meta */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {course.enrollment_count}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              {course.modules?.length || 0} modules
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {course.credits} credits
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-xs font-medium text-gray-700">{course.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
