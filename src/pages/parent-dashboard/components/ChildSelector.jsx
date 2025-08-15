import React, { useState } from 'react';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ChildSelector = ({ selectedChild, onChildChange }) => {
  const children = [
    {
      id: 1,
      name: "Emma Johnson",
      grade: "Grade 8",
      class: "8-A",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
      school: "Lincoln Middle School"
    },
    {
      id: 2,
      name: "Alex Johnson",
      grade: "Grade 5",
      class: "5-B",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      school: "Lincoln Elementary School"
    }
  ];

  const childOptions = children.map(child => ({
    value: child.id,
    label: `${child.name} - ${child.grade}`,
    description: child.school
  }));

  const currentChild = children.find(child => child.id === selectedChild) || children[0];

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-subtle">
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-muted">
          <Image
            src={currentChild.avatar}
            alt={currentChild.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground">{currentChild.name}</h3>
          <p className="text-sm text-muted-foreground">{currentChild.grade} • {currentChild.class}</p>
          <p className="text-xs text-muted-foreground">{currentChild.school}</p>
        </div>
      </div>

      <Select
        label="Switch Child"
        options={childOptions}
        value={selectedChild}
        onChange={onChildChange}
        className="w-full"
      />

      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="flex items-center space-x-2">
          <Icon name="Calendar" size={16} color="var(--color-muted-foreground)" />
          <span className="text-muted-foreground">Academic Year 2024-25</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-success rounded-full"></div>
          <span className="text-success text-xs font-medium">Active</span>
        </div>
      </div>
    </div>
  );
};

export default ChildSelector;