import { BookOpen, Clock, ChevronRight, Calendar, CheckCircle2, PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface LearningProgressProps {
  courses?: any[];
  nextGoal?: string;
}

export const LearningProgress = ({ courses, nextGoal }: LearningProgressProps) => {
  const allCourses = courses || [];
  
  // Find the first enrolled course
  const enrolledCourse = allCourses.find((c: any) => c.UserCourse?.status === 'enrolled');
  const progress = enrolledCourse?.UserCourse?.progress || 0;

  const dailyTasks = [
    { title: enrolledCourse ? `Continue: ${enrolledCourse.title}` : 'Enroll in a course', description: enrolledCourse ? `You're ${progress}% through — keep going!` : 'Explore the course catalogue', done: false },
    { title: 'Goal: ' + (nextGoal || 'Complete pending missions'), description: 'Make sure to finish your next milestone', done: false },
    { title: 'Upload Portfolio Project', description: 'Submit your latest artwork for mentor review (+500 XP)', done: false }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
      {/* Current Course */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-900 border border-slate-800 p-6 rounded-3xl h-full flex flex-col shadow-xl"
      >
        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="text-blue-400" />
          <h2 className="text-xl font-bold text-white">Learning Progress</h2>
        </div>
        
        {enrolledCourse ? (
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <p className="text-slate-400 text-sm mb-1 uppercase tracking-wider font-semibold">Current Course</p>
              <h3 className="text-2xl font-bold text-white mb-2">{enrolledCourse.title}</h3>
              <p className="text-orange-400 text-sm flex items-center gap-2 mb-6">
                <PlayCircle size={16} /> {enrolledCourse.description || 'Keep learning!'}
              </p>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2 font-semibold">
                <span className="text-slate-300">Course Progress</span>
                <span className="text-white">{progress}%</span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden mb-6">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-teal-400 rounded-full shadow-[0_0_10px_rgba(56,189,248,0.5)] transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              <button className="w-full bg-white text-slate-900 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
                Resume Learning <ChevronRight size={18} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <h3 className="text-lg font-bold text-white mb-2">No active courses</h3>
            <p className="text-slate-400 text-sm mb-6">You have completed all your enrolled courses.</p>
            <button className="bg-blue-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors">
              Browse New Courses
            </button>
          </div>
        )}
      </motion.div>

      {/* Daily Tasks / Today's Focus */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-slate-900 border border-slate-800 p-6 rounded-3xl h-full flex flex-col shadow-xl"
      >
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="text-pink-400" />
          <h2 className="text-xl font-bold text-white">Today's Focus</h2>
        </div>

        <div className="space-y-4 flex-1">
          {dailyTasks.map((task, i) => (
            <div key={i} className="flex gap-4 group cursor-pointer p-3 rounded-xl hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-700">
              <div className={`mt-1 shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                task.done ? 'bg-green-500 border-green-500 text-white' : 'border-slate-600 group-hover:border-orange-500'
              }`}>
                {task.done && <CheckCircle2 size={14} />}
              </div>
              <div>
                <h4 className={`text-sm font-bold ${task.done ? 'text-slate-500 line-through' : 'text-white group-hover:text-orange-400'} transition-colors`}>
                  {task.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1">{task.description}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
