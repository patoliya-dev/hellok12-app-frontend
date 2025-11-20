import React, { useState, useEffect } from "react";
import Icon from "../../../../components/AppIcon";
import Image from "../../../../components/AppImage";
import Button from "../../../../components/ui/Button";
import Input from "../../../../components/ui/Input";
import Loader from "../../../../components/ui/Loader";
import Modal from "../../../../components/ui/Modal";
import {
  listTeachers,
  addParticipantsToGroup,
  leaveGroup,
} from "../../../../services/messages/message.service";
import { errorToast, successToast } from "../../../../utils/utils";
import { useSocket } from "../../../../services/sockets/ws";

const ParticipantPanel = ({
  conversation,
  participants,
  currentUser,
  onParticipantsUpdated,
  onLeaveGroup,
}) => {
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addingUserId, setAddingUserId] = useState(null); // Track specific user being added
  const [leaving, setLeaving] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const { socket } = useSocket();

  useEffect(() => {
    if (showAddMemberModal) {
      loadUsers();
    }
  }, [showAddMemberModal]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await listTeachers();
      const participantIds = participants.map((p) => p._id);
      const availableUsers = data.filter(
        (user) => !participantIds.includes(user._id)
      );

      setUsers(availableUsers);
    } catch (err) {
      console.error("Failed to load users", err);
      errorToast("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleAddParticipant = async (userId) => {
    try {
      setAddingUserId(userId);
      const updatedThread = await addParticipantsToGroup(
        conversation._id,
        [userId]
      );

      successToast("Participant added successfully");
      if (socket && socket.connected) {
        socket.emit("addParticipants", {
          threadId: conversation._id,
          participants: [userId],
          userId: currentUser.id,
        });
      }
      if (onParticipantsUpdated) {
        onParticipantsUpdated(updatedThread);
      }
      setShowAddMemberModal(false);
    } catch (err) {
      console.error("Failed to add participant:", err);
      errorToast(err.message || "Failed to add participant");
    } finally {
      setAddingUserId(null);
    }
  };

  const handleLeaveGroup = async () => {
    try {
      setLeaving(true);
      await leaveGroup(conversation._id);
      if (socket && socket.connected) {
        socket.emit("leaveGroup", {
          threadId: conversation._id,
          userId: currentUser.id,
        });
      }
      if (onLeaveGroup) {
        onLeaveGroup(conversation._id);
      }
    } catch (err) {
      console.error("Failed to leave group:", err);
      errorToast(err.message || "Failed to leave group");
    } finally {
      setLeaving(false);
      setShowLeaveConfirm(false);
    }
  };


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
            onClick={() => setShowAddMemberModal(true)}
            className="w-full"
          >
            <Icon name="UserPlus" size={16} className="mr-2" />
            Add Member
          </Button>
        )}
      </div>

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <Modal
          width="max-w-md w-full"
          title="Add Member to Group"
          onClose={() => setShowAddMemberModal(false)}
        >
          {loading ? (
            <div className="flex justify-center items-center h-[350px]">
              <Loader />
            </div>
          ) : (
            <div className="flex flex-col gap-4 h-[350px] overflow-y-scroll p-4">
              {users.length === 0 ? (
                <div className="flex justify-center items-center h-full text-muted-foreground">
                  No available users to add
                </div>
              ) : (
                users.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between border-b border-[#E4E4E4] pb-4 cursor-pointer hover:bg-muted/50 transition-colors rounded-lg p-2"
                    onClick={() => !addingUserId && handleAddParticipant(user._id)}
                  >
                    <div className="flex items-center gap-4">
                      <Image
                        src={
                          user?.profileImage?.url ||
                          "/assets/images/no_image.png"
                        }
                        alt={user?.name}
                        width={56}
                        height={56}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="text-body1 font-medium text-brand-gray-800 hover:text-primary">
                          {user?.name}
                        </h4>
                        {user?.email && (
                          <p className="text-sm text-muted-foreground">
                            {user?.email}
                          </p>
                        )}
                      </div>
                    </div>
                    {addingUserId === user._id && (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </Modal>
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
                    participant?.availabilityStatus
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
                    {
                      participant?._id !== currentUser?.id ?
                        participant?.availabilityStatus === "online"
                          ? "Online"
                          : "Offline"
                        : ""
                    }
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Group Actions */}
      <div className="p-4 border-t border-border space-y-2">
        {conversation?.threadType === "GROUP" && !showLeaveConfirm && !conversation?.hasLeft && currentUser?.role !== "teacher" && (
          <Button
            variant="destructive"
            size="sm"
            className="w-full"
            onClick={() => setShowLeaveConfirm(true)}
            disabled={leaving}
          >
            <Icon name="LogOut" size={16} className="mr-2" />
            Leave Group
          </Button>
        )}

        {showLeaveConfirm && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground text-center">
              Are you sure you want to leave this group?
            </p>
            <div className="flex space-x-2">
              <Button
                variant="destructive"
                size="sm"
                className="flex-1"
                onClick={handleLeaveGroup}
                disabled={leaving}
              >
                {leaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Leaving...
                  </>
                ) : (
                  "Yes, Leave"
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => setShowLeaveConfirm(false)}
                disabled={leaving}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParticipantPanel;