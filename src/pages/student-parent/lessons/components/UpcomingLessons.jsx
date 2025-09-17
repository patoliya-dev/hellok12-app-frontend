import LessonCard from 'components/ui/LessonCard';
import { upcomingLessons } from '../../../../services/mockApi';

const UpcomingLessons = () => {
  return (
    <div className="space-y-4">
      {upcomingLessons.map(lesson => (
        <LessonCard key={lesson._id} lesson={lesson} />
      ))}
    </div>
  );
};

export default UpcomingLessons;
