import { useState, useMemo } from 'react';
import LessonCard from 'components/ui/LessonCard';
import { historyLessons } from '../../../../services/mockApi';

const LessonsHistory = () => {
  const [activeFilter, setActiveFilter] = useState('All Lessons');

  const filteredLessons = useMemo(() => {
    if (activeFilter === 'All Lessons') return historyLessons;
    return historyLessons.filter(lesson => lesson.status === activeFilter);
  }, [activeFilter]);

  const counts = useMemo(() => ({
    'All Lessons': historyLessons.length,
    Completed: historyLessons.filter(l => l.status === 'Completed').length,
    Cancelled: historyLessons.filter(l => l.status === 'Cancelled').length,
  }), []);

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        {['All Lessons', 'Completed', 'Cancelled'].map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeFilter === filter
              ? 'bg-blue-800 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-100 border'
              }`}
          >
            {filter} ({counts[filter]})
          </button>
        ))}
      </div>
      <div className="space-y-4">
        {filteredLessons.map(lesson => (
          <LessonCard key={lesson._id} lesson={lesson} />
        ))}
      </div>
    </div>
  );
};

export default LessonsHistory;
