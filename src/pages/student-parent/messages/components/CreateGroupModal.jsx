import React, { useState, useEffect } from "react";
import Button from "../../../../components/ui/Button";
import Input from "../../../../components/ui/Input";
import Image from "../../../../components/AppImage";
import Icon from "../../../../components/AppIcon";
import Loader from "../../../../components/ui/Loader";
import {
  listTeachers,
  createThread,
} from "../../../../services/messages/message.service";

const CreateGroupModal = ({ isOpen, onClose, onGroupCreated, currentUser }) => {
  const [groupName, setGroupName] = useState("");
  const [step, setStep] = useState(1);
  const [tempSelected, setTempSelected] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (isOpen && step === 2) {
      loadUsers();
    }
  }, [isOpen, step]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await listTeachers();
      // Filter out current user from the list
      setUsers(data.filter((user) => user._id !== currentUser?.id));
    } catch (err) {
      console.error("Failed to load users", err);
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setGroupName("");
    setStep(1);
    setTempSelected([]);
    setSelectedMembers([]);
    setError("");
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  const toggleTempMember = (member) => {
    setTempSelected((prev) => {
      const exists = prev.some((m) => m._id === member._id);
      if (exists) {
        return prev.filter((m) => m._id !== member._id);
      } else {
        return [...prev, member];
      }
    });
  };

  const handleAddClick = () => {
    if (tempSelected.length === 0) {
      setError("Please select at least one member");
      return;
    }
    setSelectedMembers(tempSelected);
    setError("");
    setStep(1);
  };

  const handleSubmit = async () => {
    // Validation
    if (!groupName.trim()) {
      setError("Group name is required");
      return;
    }

    if (selectedMembers.length === 0) {
      setError("Please add at least one member");
      return;
    }

    try {
      setCreating(true);
      setError("");
      // Create participants array (current user + selected members)
      const participants = [
        currentUser?.id,
        ...selectedMembers.map((member) => member._id),
      ];
      // Create group thread
      const groupThread = await createThread({
        userId: currentUser?.id,
        threadType: "GROUP",
        groupName: groupName.trim(),
        participants: participants,
      });
      // Show success screen
      setStep(3);
      // After 2 seconds, close modal and notify parent
      setTimeout(() => {
        onGroupCreated(groupThread);
        handleClose();
      }, 2000);
    } catch (err) {
      console.error("❌ Failed to create group:", err);
      setError(err.message || "Failed to create group. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const getContent = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <Input
              label="Group Name"
              placeholder="Enter group name (e.g., Study Group, Project Team)"
              value={groupName}
              onChange={(e) => {
                setGroupName(e.target.value);
                setError("");
              }}
              required
              error={error}
              disabled={creating}
            />

            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-body2 font-medium text-foreground">
                  Group Members
                </h3>
                {selectedMembers.length > 0 && (
                  <span className="text-sm text-muted-foreground">
                    {selectedMembers.length} member
                    {selectedMembers.length > 1 ? "s" : ""} selected
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                {selectedMembers?.map((member, index) => (
                  <div key={index} className="relative group">
                    <Image
                      src={
                        member?.profileImage?.url ||
                        "/assets/images/no_image.png"
                      }
                      alt={member?.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {/* Remove button on hover */}
                    <button
                      onClick={() => {
                        setSelectedMembers((prev) =>
                          prev.filter((m) => m._id !== member._id)
                        );
                        setTempSelected((prev) =>
                          prev.filter((m) => m._id !== member._id)
                        );
                      }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <Icon name="X" size={12} />
                    </button>
                    <p className="text-xs text-center mt-1 max-w-[48px] truncate">
                      {member?.name.split(" ")[0]}
                    </p>
                  </div>
                ))}

                {/* Add Member Button */}
                <div className="flex flex-col items-center">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center border-2 border-dashed border-primary hover:bg-primary/10 cursor-pointer transition-colors"
                    onClick={() => setStep(2)}
                  >
                    <Icon name="Plus" size={24} className="text-primary" />
                  </div>
                  <p className="text-xs text-center mt-1 text-primary">Add</p>
                </div>
              </div>

              {selectedMembers.length === 0 && (
                <p className="text-sm text-muted-foreground mt-4">
                  Click the + button to add members to your group
                </p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            {error && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center h-[350px]">
                <Loader />
              </div>
            ) : users.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[350px]">
                <Icon
                  name="Users"
                  size={48}
                  className="text-muted-foreground mb-2"
                />
                <p className="text-muted-foreground">No users available</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4 h-[350px] overflow-y-scroll pr-2">
                {users.map((user, index) => {
                  const isChecked = tempSelected.some(
                    (m) => m._id === user._id
                  );

                  return (
                    <div
                      key={index}
                      className={`flex items-center justify-between border rounded-lg p-3 transition-colors cursor-pointer ${
                        isChecked
                          ? "bg-primary/10 border-primary"
                          : "border-border hover:bg-muted"
                      }`}
                      onClick={() => toggleTempMember(user)}
                    >
                      <div className="flex items-center gap-4">
                        <Image
                          src={
                            user?.profileImage?.url ||
                            "/assets/images/no_image.png"
                          }
                          alt={user?.name}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="text-body1 font-medium text-foreground">
                            {user?.name}
                          </h4>
                          {user?.email && (
                            <p className="text-sm text-muted-foreground">
                              {user?.email}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Custom Checkbox */}
                      <div
                        className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                          isChecked
                            ? "bg-primary border-primary"
                            : "border-border bg-background"
                        }`}
                      >
                        {isChecked && (
                          <Icon name="Check" size={16} className="text-white" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {tempSelected.length > 0 && (
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-sm text-foreground">
                  <span className="font-semibold">{tempSelected.length}</span>{" "}
                  member
                  {tempSelected.length > 1 ? "s" : ""} selected
                </p>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="px-8 py-6 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Check" size={40} className="text-success" />
              </div>
              <h4 className="text-h4 font-semibold text-foreground mb-2">
                Group Created Successfully!
              </h4>
              <p className="text-muted-foreground">
                {groupName} has been created with {selectedMembers.length}{" "}
                member
                {selectedMembers.length > 1 ? "s" : ""}
              </p>
            </div>

            {/* Group Members Preview */}
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-medium text-foreground mb-3">
                Group Members:
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {selectedMembers.slice(0, 5).map((member, idx) => (
                  <div
                    key={idx}
                    className="text-xs bg-background px-3 py-1 rounded-full"
                  >
                    {member.name}
                  </div>
                ))}
                {selectedMembers.length > 5 && (
                  <div className="text-xs bg-background px-3 py-1 rounded-full text-muted-foreground">
                    +{selectedMembers.length - 5} more
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className={`${
          step === 3 ? "w-full max-w-2xl" : "w-full max-w-lg"
        } bg-card rounded-lg shadow-2xl mx-4 overflow-hidden transition-all`}
      >
        {/* Header */}
        <div
          className={`p-6 border-b border-border ${
            step === 3 && "border-none"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {step === 2 && (
                <button
                  onClick={() => {
                    setStep(1);
                    setError("");
                  }}
                  className="hover:bg-muted rounded-full p-1 transition-colors"
                >
                  <Icon
                    name="ChevronLeft"
                    size={24}
                    className="text-foreground"
                  />
                </button>
              )}
              {step !== 3 && (
                <h1 className="text-xl font-semibold text-foreground">
                  {step === 1 ? "Create New Group" : "Select Members"}
                </h1>
              )}
            </div>

            <button
              onClick={handleClose}
              disabled={creating}
              className="hover:bg-muted rounded-full p-2 transition-colors disabled:opacity-50"
            >
              <Icon name="X" size={20} className="text-foreground" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">{getContent()}</div>

        {/* Footer Actions */}
        {step !== 3 && (
          <div className="p-6 border-t border-border bg-muted/30">
            <div className="flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={creating}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={step === 1 ? handleSubmit : handleAddClick}
                disabled={creating || (step === 2 && tempSelected.length === 0)}
                className="min-w-[100px]"
              >
                {creating ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating...
                  </div>
                ) : step === 1 ? (
                  "Create Group"
                ) : (
                  `Add (${tempSelected.length})`
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateGroupModal;
