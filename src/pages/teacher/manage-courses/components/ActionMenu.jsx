import Icon from "components/AppIcon";
import Button from "components/ui/Button";
import React from "react";

const ActionMenu = ({
  course,
  setOpenMenuId,
  onEdit,
  onDuplicate,
  onDelete,
}) => {
  const actions = [
    {
      label: "Edit",
      icon: "Edit",
      color: "",
      onClick: (course) => onEdit(course),
    },
    {
      label: "Duplicate",
      icon: "Copy",
      color: "",
      onClick: (course) => onDuplicate(course),
    },
    {
      label: "Remove",
      icon: "Trash",
      color: "text-error",
      onClick: (course) => onDelete(course?.id),
    },
  ];

  return (
    <div className="absolute right-24 mt-2 w-34 bg-popover border border-border rounded-lg shadow-lg z-50">
      {actions.map((action, index) => (
        <div className="flex items-center">
          <Button
            variant="ghost"
            iconName={action.icon}
            className={`!justify-start w-full ${action.color}`}
            onClick={() => {
              action.onClick(course);
              setOpenMenuId(null); // optional: close menu after action
            }}
          >
            {action.label}
          </Button>
        </div>
      ))}
    </div>
  );
};

export default ActionMenu;
