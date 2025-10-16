import Icon from "components/AppIcon";
import Button from "components/ui/Button";

const QuickAction = ({ onInviteTeacher }) => {
  const quickActions = [
    {
      id: 1,
      title: "Invite Teacher",
      description: "Send invitation to new teachers",
      icon: "UserPlus",
      color: "text-primary",
      bgColor: "bg-primary/10",
      action: () => onInviteTeacher(),
    },
    {
      id: 2,
      title: "Create Course",
      description: "Set up new course schedule",
      icon: "Calendar",
      color: "text-accent",
      bgColor: "bg-accent/10",
      action: () => console.log("Create class"),
    },
    {
      id: 3,
      title: "Manage Payments",
      description: "View billing and transactions",
      icon: "CreditCard",
      color: "text-warning",
      bgColor: "bg-warning/10",
      action: () => console.log("Manage payments"),
    },
  ];

  return (
    <div className="bg-card rounded-lg border border-border">
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-semibold text-foreground">Quick Actions</h2>
        <p className="text-sm text-muted-foreground">
          Common administrative tasks
        </p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={action.action}
              className="flex items-start space-x-3 px-4 pt-4 pb-6 rounded-lg border border-border hover:bg-muted/50 transition-micro text-left"
            >
              <div
                className={`w-10 h-10 rounded-lg ${action.bgColor} flex justify-center flex-shrink-0`}
              >
                <Icon
                  name={action.icon}
                  size={20}
                  color={`var(--color-${action.color.replace("text-", "")})`}
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-brand-gray-800">
                  {action.title}
                </h3>
                <p className="text-sm text-brand-gray-500">
                  {action.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickAction;
