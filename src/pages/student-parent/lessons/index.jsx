import { useState } from "react";
import UpcomingLessons from "./components/UpcomingLessons";
import LessonsHistory from "./components/LessonsHistory";
import { Calendar, CalendarClock, ChevronDown, History } from "lucide-react";
import RoleBasedHeader from "../../../components/ui/RoleBasedHeader";

const LessonsPage = () => {
  const [activeTab, setActiveTab] = useState("upcoming");

  const getTabClass = (tabName) => {
    return `px-4 py-2.5 rounded-md font-medium text-sm transition-all duration-200 flex items-center gap-2 ${activeTab === tabName
        ? "bg-white shadow-sm text-brand-gray-800"
        : "bg-transparent text-brand-gray-600 hover:bg-gray-50"
      }`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <RoleBasedHeader />
      <main className="pt-16 pb-20 lg:pb-8">
        <div className="p-4 md:p-8 max-w-[1400px] mx-auto">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-brand-gray-800">
                Lessons
              </h1>
              <p className="text-brand-gray-600 mt-1">
                Your learning upcoming lessons and booking history
              </p>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 bg-white rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                <Calendar size={16} /> My Calendar
              </button>
              <div className="relative w-full md:w-56">
                <select className="w-full px-4 py-2 border border-gray-300 bg-white rounded-md text-sm font-medium text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-brand-blue">
                  <option>Select Course</option>
                  <option>Spanish for Beginners</option>
                  <option>Advanced Japanese</option>
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={18}
                />
              </div>
            </div>
          </header>

          <div className="flex">
            <div className="bg-brand-gray-200 p-1.5 flex items-center gap-4 rounded-lg sm mb-6">
              {/* <div className='flex justify-center align-items-center items-center'> */}
              <button
                className={getTabClass("upcoming")}
                onClick={() => setActiveTab("upcoming")}
              >
                <CalendarClock size={16} />
                Upcoming Lessons
              </button>

              {/* </div> */}
              {/* <div> */}
              <button
                className={getTabClass("history")}
                onClick={() => setActiveTab("history")}
              >
                <History size={16} /> Lessons History
              </button>
              {/* </div> */}
            </div>
          </div>

          <main>
            {activeTab === "upcoming" ? (
              <UpcomingLessons />
            ) : (
              <LessonsHistory />
            )}
          </main>
        </div>
      </main>
    </div>
  );
};

export default LessonsPage;
