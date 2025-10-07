import Icon from "components/AppIcon";
import Button from "components/ui/Button";
import React from "react";

const ActionMenu = ({
  className = "",
  data,
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
      onClick: onEdit,
    },
    {
      label: "Duplicate",
      icon: "Copy",
      color: "",
      onClick: (data) => onDuplicate(data),
    },
    {
      label: "Remove",
      icon: "Trash",
      color: "text-error",
      onClick: onDelete,
    },
  ];

  return (
    <div
      className={`absolute right-4 md:right-8 lg:right-12 xl:right-24 mt-2 w-34 bg-popover border border-border rounded-lg shadow-lg z-50 ${className}`}
    >
      {actions.map((action, index) => (
        <div key={index} className="flex items-center">
          <Button
            variant="ghost"
            iconName={action.icon}
            className={`!justify-start w-full ${action.color}`}
            onClick={() => {
              action.onClick(data);
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
