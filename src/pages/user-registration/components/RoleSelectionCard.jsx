import React from 'react';
// import Icon from '../../../components/AppIcon';
import { TeacherIcon, SchoolIcon, StudentParentIcon } from '../../../components/icons';
// import TeacherIcon from '../../../assets/teacher-icon.svg';
// import SchoolIcon from '../../../assets/school-icon.svg';
// import StudentIcon from '../../../assets/student-parent-icon.svg';
// import StudentBlueIcon from '../../../assets/student-parent-blue-icon.svg';
// import TeacherBlueIcon from '../../../assets/teacher-blue-icon.svg';
// import SchoolBlueIcon from '../../../assets/school-blue-icon.svg';

const RoleSelectionCard = ({ role, isSelected, onSelect }) => {
  const roleConfig = {
    "student/parent": {
      icon: StudentParentIcon,
      // icon: <StudentParentIcon selected={isSelected} />,
      title: 'Student/Parent',
      description: 'Join classes, track progress, and learn with games',
    },    
    teacher: {
      icon: TeacherIcon,
      // icon: <TeacherIcon selected={isSelected} />,
      title: 'Teacher',
      description: 'Teach students, manage schedule, and earn income',
    },
    school: {
      icon: SchoolIcon,
      // icon: <SchoolIcon selected={isSelected} />,
      title: 'School',
      description: 'Manage school operations, teachers, and students',      
    }
  };

  const config = roleConfig[role];
  const Icon = config.icon;
  return (
    <div
      onClick={() => onSelect(role)}
      className={`
        w-[127px] relative p-6 rounded-[5px] border-2 cursor-pointer transition-smooth hover:shadow-elevated
        ${isSelected
          ? 'border-primary bg-primary/5 shadow-subtle'
          : 'border-border bg-surface hover:border-primary/50'
        }
      `}
    >

      <div className="flex flex-col items-center text-center space-y-4">
        {/* <StudentParentIcon selected={isSelected} /> */}
        {/* {<Icon selected={isSelected} />} */}
        {/* <img src={config.icon} alt="Company Logo" className='ml-1' size={16} /> */}
        <div>
          <h3 className={`text-xs font-semibold ${
            isSelected ? 'text-primary' : 'text-foreground'
          }`}>
            {config.title}
          </h3>
          <p className="text-[11px] text-muted-foreground mt-1">
            {config.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionCard;