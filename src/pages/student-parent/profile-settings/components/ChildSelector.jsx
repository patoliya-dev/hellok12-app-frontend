import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { selectStudent } from 'features/profile/profileSlice';

const ChildSelector = () => {
  const dispatch = useDispatch();
  const students = useSelector(state => state.profile.students);
  const selectedChildId = useSelector(state => state.profile.selectedChildId);
  const selectedStudent = students.find(s => s.id === selectedChildId);

  const initials = selectedStudent.fullName.split(' ').map(n => n[0]).join('');

  return (
    <div className="mt-4 md:mt-2">
      <label className="text-sm font-medium text-foreground mb-2 block">Select Child Dashboard</label>
      <div
        className="flex items-center justify-between p-3 border border-border rounded-lg bg-card w-full md:w-72 cursor-pointer"
        onClick={() => {
          const nextIndex = (students.findIndex(s => s.id === selectedChildId) + 1) % students.length;
          dispatch(selectStudent(students[nextIndex].id));
        }}
        aria-label="Select Child Dashboard"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold">
            {initials}
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">{selectedStudent.fullName}</p>
            <p className="text-text-secondary text-xs">{selectedStudent.grade} • {selectedStudent.language}</p>
          </div>
        </div>
        <ChevronDown className="text-muted-foreground" size={20} />
      </div>
    </div>
  );
};

export default ChildSelector;
