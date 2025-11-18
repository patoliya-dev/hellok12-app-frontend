import React, { useState } from "react";
import Icon from "../../../../components/AppIcon";
import Image from "../../../../components/AppImage";
import Button from "../../../../components/ui/Button";
import Input from "../../../../components/ui/Input";

const ParticipantPanel = ({
  conversation,
  participants,
  onAddParticipant,
  onRemoveParticipant,
  currentUser,
}) => {
  const [showAddMember, setShowAddMember] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredParticipants = participants?.filter(
    (participant) =>
      participant?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      participant?.role?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case "teacher":
        return "text-primary bg-primary/10";
      case "parent":
        return "text-secondary bg-secondary/10";
      case "student":
        return "text-success bg-success/10";
      case "admin":
        return "text-warning bg-warning/10";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "online":
        return "bg-success";
      case "away":
        return "bg-warning";
      case "busy":
        return "bg-error";
      default:
        return "bg-muted-foreground";
    }
  };

  if (!conversation || conversation?.threadType === "direct") {
    return null;
  }

  return (
    <div className="w-80 bg-card border-l border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Participants</h3>
          <span className="text-sm text-muted-foreground">
            {participants?.length} members
          </span>
        </div>

        {/* Search */}
        <Input
          type="search"
          placeholder="Search participants..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e?.target?.value)}
          className="mb-3"
        />

        {/* Add Member Button */}
        {(currentUser?.role === "teacher" || currentUser?.role === "admin") && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddMember(!showAddMember)}
            iconName="UserPlus"
            iconPosition="left"
            className="w-full"
          >
            Add Member
          </Button>
        )}
      </div>
      {/* Add Member Form */}
      {showAddMember && (
        <div className="p-4 border-b border-border bg-muted/30">
          <div className="space-y-3">
            <Input
              type="email"
              placeholder="Enter email address"
              label="Add by email"
            />
            <div className="flex space-x-2">
              <Button size="sm" className="flex-1">
                Send Invite
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddMember(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Participants List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2 space-y-1">
          {filteredParticipants?.map((participant) => (
            <div
              key={participant?._id}
              className="flex items-center p-3 rounded-lg hover:bg-muted transition-colors duration-200"
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0 mr-3">
                <Image
                  src={
                    participant?.profileImage?.url ||
                    "/assets/images/no_image.png"
                  }
                  alt={participant?.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                {/* Status Indicator */}
                <div
                  className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-card ${getStatusColor(
                    participant?.status
                  )}`}
                ></div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-foreground truncate">
                    {participant?.name}
                    {participant?._id === currentUser?.id && (
                      <span className="text-xs text-muted-foreground ml-1">
                        (You)
                      </span>
                    )}
                  </h4>

                  {/* Actions Menu */}
                  {(currentUser?.role === "teacher" ||
                    currentUser?.role === "admin") &&
                    participant?._id !== currentUser?.id && (
                      <div className="relative">
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <Icon name="MoreHorizontal" size={14} />
                        </Button>
                      </div>
                    )}
                </div>

                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${getRoleColor(
                      participant?.role
                    )}`}
                  >
                    {participant?.role}
                  </span>

                  <span className="text-xs text-muted-foreground">
                    {participant?.status === "online"
                      ? "Online"
                      : participant?.status === "away"
                      ? "Away"
                      : participant?.status === "busy"
                      ? "Busy"
                      : "Offline"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Group Actions */}
      <div className="p-4 border-t border-border space-y-2">
        {conversation?.threadType === "GROUP" && (
          <Button
            variant="destructive"
            size="sm"
            className="w-full"
            iconName="LogOut"
            iconPosition="left"
          >
            Leave Group
          </Button>
        )}
      </div>
    </div>
  );
};

export default ParticipantPanel;
