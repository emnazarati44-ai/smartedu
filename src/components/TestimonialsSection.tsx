import React from 'react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Maya Patel',
    role: 'Computer Science Student',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    text: 'SmartEdu completely transformed how I approach my studies. The course materials are well-organized, and the discussion boards help me connect with classmates even outside of class.',
    rating: 5,
  },
  {
    name: 'Dr. James Wilson',
    role: 'Professor, CS Department',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    text: 'The professor dashboard gives me incredible insights into student engagement. I can identify struggling students early and provide targeted support. It\'s a game-changer.',
    rating: 5,
  },
  {
    name: 'Sophie Williams',
    role: 'Mathematics Student',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    text: 'I love how easy it is to find study groups and collaborate with other students. The platform feels modern and intuitive - nothing like the clunky systems we used before.',
    rating: 5,
  },
];

const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">Testimonials</span>
          <h2 className="text-3xl font-bold text-gray-900 mt-2">Loved by Our Community</h2>
          <p className="text-gray-600 mt-3">Hear from students and professors who use SmartEdu every day</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-gray-50 rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 relative"
            >
              <Quote className="w-8 h-8 text-indigo-200 absolute top-4 right-4" />
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-6 italic">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
