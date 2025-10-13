import LessonCard from "./LessonCard";

const Lessons = ({ upcomingLessons }) => {
  return (
    <div className="space-y-4">
      {upcomingLessons.map((lesson) => (
        <LessonCard key={lesson.id} lesson={lesson} />
      ))}
    </div>
  );
};

export default Lessons;
