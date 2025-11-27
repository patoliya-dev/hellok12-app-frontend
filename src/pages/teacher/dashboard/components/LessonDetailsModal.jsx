import React from 'react';
import {
    X, MessageSquare, Star, Calendar, Clock, Gamepad2, FlaskConical, User, Video, AlertCircle,
    Gift,
    MapPin,
    Users,
} from 'lucide-react';
import Badge from '../../../../components/ui/Badge'; // Adjusted path to your Badge component
import { VideoIcon } from 'components/icons';

// Helper to format date and time as required by the design
const formatDate = (date) => {
    if (!date) return { fullDate: '', time: '' };
    return {
        date: new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }),
    };
};

// Map tag names to icons and colors for the Badge component
const tagDetails = {
    'Curriculum-Aligned Games': { icon: <Gamepad2 size={16} />, color: 'orange' },
    'Trial Session': { icon: <Gift size={16} />, color: 'sky' },
    '1-on-1': { icon: <User size={16} />, color: 'blue' }, // Assuming you add 'purple' to your Badge colors,
    'Group': { icon: <Users size={16} />, color: 'blue' },
    'Online': { icon: <VideoIcon size={14} className="w-[12px] h-[10px]" selected={true} />, color: 'green' },
    'In-person': { icon: <MapPin size={16} />, color: 'green' },
};

const statusDetails = {
    'starting-soon': { color: 'orange', icon: <AlertCircle size={14} />, text: 'Starting Soon' },
    'scheduled': { color: 'blue', icon: <Calendar size={14} />, text: 'Scheduled' },
    'completed': { color: 'green', text: 'Completed' },
    'pending': { color: 'sky', text: 'Pending' },
    'cancelled': { color: 'error', text: 'Cancelled' }
}

const LessonDetailsModal = ({ lesson, onClose }) => {
    if (!lesson) {
        return null;
    }

    const statusInfo = statusDetails[lesson.status] || statusDetails['pending'];

    return (
        // Modal overlay
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 font-sans">
            <div className="w-full max-w-2xl rounded-2xl bg-white p-6 sm:p-8 shadow-modal animate-in fade-in-0 zoom-in-95">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-brand-gray-800">
                        Lessons Details
                    </h2>
                    <button className="text-brand-gray-500 hover:text-brand-gray-800" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="mt-6 border-t border-gray-200 pt-6">
                    {/* Section Title: Subject */}
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-brand-gray-800">
                            {lesson.subject}
                        </h3>
                        <Badge text={statusInfo.text} color={statusInfo.color} icon={statusInfo.icon} />
                    </div>

                    {/* Tutor Information Card */}
                    <div className="mt-4 flex items-center gap-4 rounded-lg bg-brand-gray-200 p-4">
                        <img
                            src={lesson.teacher.avatar}
                            alt={lesson.teacher.name}
                            className="h-16 w-16 rounded-full object-cover"
                        />
                        <div className="flex-grow">
                            <h4 className="text-lg font-bold text-brand-gray-800">
                                {lesson.teacher.name}
                            </h4>
                            <p className="text-sm text-brand-gray-500">{lesson.description}</p>
                        </div>
                    </div>

                    {/* Date, Duration, and Time Section */}
                    <div className="mt-6 grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6">
                        <div className="flex items-start gap-3">
                            <Calendar className="mt-1 h-5 w-5 text-brand-gray-500" />
                            <div>
                                <p className="text-sm text-brand-gray-500">Date</p>
                                <p className="font-semibold text-brand-gray-800">{formatDate(lesson.date).date}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            {lesson.address && (<>
                                <MapPin className="mt-1 h-5 w-5 text-brand-gray-500" />
                                <div>
                                    <p className="text-sm text-brand-gray-500">Location</p>
                                    <p className="font-semibold text-brand-gray-800">{lesson.address}</p>
                                </div>
                            </>
                            )}
                        </div>
                        <div className="flex items-start gap-3">
                            <Clock className="mt-1 h-5 w-5 text-brand-gray-500" />
                            <div>
                                <p className="text-sm text-brand-gray-500">Duration</p>
                                <p className="font-semibold text-brand-gray-800">{lesson.duration} min</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3"></div>
                        <div className="flex items-start gap-3">
                            <Clock className="mt-1 h-5 w-5 text-brand-gray-500" />
                            <div>
                                <p className="text-sm text-brand-gray-500">Time</p>
                                <p className="font-semibold text-brand-gray-800">{lesson.startTime}</p>
                            </div>
                        </div>
                    </div>

                    {/* Tags Section */}
                    {lesson.tags && lesson.tags.length > 0 && (
                        <div className="mt-6 flex flex-wrap items-center gap-3">
                            {lesson.tags.map((tag) => (
                                <Badge
                                    key={tag}
                                    text={tag}
                                    color={tagDetails[tag]?.color || 'sky'}
                                    icon={tagDetails[tag]?.icon}
                                />
                            ))}
                        </div>
                    )}

                    {/* Lessons Description Section */}
                    {lesson.lessonDescription && (
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold text-brand-gray-800">
                                Lessons Description
                            </h3>
                            <p className="mt-2 text-base text-brand-gray-500">
                                {lesson.lessonDescription}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LessonDetailsModal;
