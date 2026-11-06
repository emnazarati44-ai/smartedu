import React from 'react';
import { BookOpen, Users, Award, ArrowRight, Play } from 'lucide-react';

interface HeroProps {
  onNavigate: (view: string) => void;
  onOpenAuth: () => void;
  isAuthenticated: boolean;
}

const Hero: React.FC<HeroProps> = ({ onNavigate, onOpenAuth, isAuthenticated }) => {
  const stats = [
    { icon: <Users className="w-5 h-5" />, value: '12,500+', label: 'Active Students' },
    { icon: <BookOpen className="w-5 h-5" />, value: '350+', label: 'Courses' },
    { icon: <Award className="w-5 h-5" />, value: '98%', label: 'Satisfaction' },
  ];

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-900" />
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
      }} />

      {/* Floating shapes */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white space-y-8">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white/90">Spring 2026 Enrollment Open</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Learn Smarter,{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Achieve Greater
              </span>
            </h1>

            <p className="text-lg text-white/70 max-w-lg leading-relaxed">
              SmartEdu connects students, professors, and administrators in one powerful platform. 
              Access courses, track progress, and collaborate seamlessly.
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => isAuthenticated ? onNavigate('courses') : onOpenAuth()}
                className="group flex items-center gap-2 bg-white text-indigo-900 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-lg shadow-black/20"
              >
                {isAuthenticated ? 'Browse Courses' : 'Get Started'}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => onNavigate('courses')}
                className="group flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition-all"
              >
                <Play className="w-4 h-4" />
                Explore Courses
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
              {stats.map((stat, i) => (
                <div key={i} className="text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-white/60 mb-1">
                    {stat.icon}
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold">{stat.value}</p>
                  <p className="text-sm text-white/50">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Feature Cards */}
          <div className="hidden lg:block relative">
            <div className="space-y-4">
              {/* Card 1 */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 ml-12 transform hover:-translate-y-1 transition-transform">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">350+ Courses</h3>
                    <p className="text-white/60 text-sm">Across 8 departments</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  {['CS', 'Math', 'Physics', 'Business'].map((dept) => (
                    <span key={dept} className="text-xs bg-white/10 text-white/80 px-2 py-1 rounded-md">{dept}</span>
                  ))}
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mr-12 transform hover:-translate-y-1 transition-transform">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Live Discussions</h3>
                    <p className="text-white/60 text-sm">Connect with peers & professors</p>
                  </div>
                </div>
                <div className="mt-4 flex -space-x-2">
                  {[
                    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=40&h=40&fit=crop',
                    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop',
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop',
                    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop',
                  ].map((src, i) => (
                    <img key={i} src={src} alt="" className="w-8 h-8 rounded-full border-2 border-indigo-900 object-cover" />
                  ))}
                  <div className="w-8 h-8 rounded-full bg-indigo-500 border-2 border-indigo-900 flex items-center justify-center text-xs text-white font-medium">
                    +99
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 ml-6 transform hover:-translate-y-1 transition-transform">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <Award className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Track Progress</h3>
                    <p className="text-white/60 text-sm">Real-time analytics dashboard</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-xs text-white/60">
                    <span>Course Completion</span>
                    <span>78%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full" style={{ width: '78%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
