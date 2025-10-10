import React, { useState } from "react";
import Button from "../../../../components/ui/Button";
import Input from "../../../../components/ui/Input";
import Image from "../../../../components/AppImage";
import Icon from "../../../../components/AppIcon";
import { mockUserData } from "../data";

const CreateGroupModal = ({ isOpen, onClose }) => {
  const [groupName, setGroupName] = useState("");
  const [step, setStep] = useState(1);
  const [tempSelected, setTempSelected] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const toggleTempMember = (member) => {
    setTempSelected((prev) => {
      const exists = prev.some((m) => m.name === member.name);
      if (exists) {
        return prev.filter((m) => m.name !== member.name);
      } else {
        return [...prev, member];
      }
    });
  };

  const handleAddClick = () => {
    setSelectedMembers(tempSelected); // ✅ store final selection
    setStep(1);
  };

  const handleSumbit = () => {
    if (!groupName.trim()) {
      setError("Group name is required");
      return;
    }
    setError("");
    setStep(3);
  };

  const getContent = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <Input
              label="Group Name"
              placeholder="Enter group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required
              error={error}
            />

            <div className="mt-6">
              <h3 className="text-body2 font-medium text-foreground mb-5">
                Add Members
              </h3>
              <div className="flex items-center gap-4">
                {selectedMembers?.map((data, index) => (
                  <Image
                    key={index}
                    src={data?.image}
                    alt={data?.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ))}
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center border border-dashed border-[#8B8B8B] cursor-pointer"
                  onClick={() => setStep(2)}
                >
                  <Icon name={"Plus"} size={28} className="text-[#8B8B8B]" />
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col gap-4 h-[350px] overflow-y-scroll">
            {mockUserData.map((user, index) => {
              const isChecked = tempSelected.some((m) => m.name === user.name);

              return (
                <div
                  key={index}
                  className="flex items-center justify-between border-b border-[#E4E4E4] pb-4"
                >
                  <div className="flex items-center gap-10">
                    <Image
                      src={user?.image}
                      alt={user?.name}
                      width={56} // for Next.js Image, must provide width & height
                      height={56}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    <h4 className="text-body1 font-medium text-brand-gray-800">
                      {user?.name}
                    </h4>
                  </div>

                  {/* Normal checkbox */}
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() =>
                      toggleTempMember({ name: user.name, image: user.image })
                    }
                    className="h-6 w-6 rounded-full bg-[#E8E8E8] border-none cursor-pointer appearance-none  checked:bg-primary checked:border-primary checked:before:text-white checked:before:flex checked:before:items-center checked:before:justify-center outline-none focus:outline-none focus:ring-0"
                  />
                </div>
              );
            })}
          </div>
        );
      case 3:
        return (
          <div className="px-18">
            <Image
              src="/assets/images/create-image.svg"
              alt="Create Group"
              className="w-full h-[300px] object-cover mb-20"
            />
            <h4 className="text-h4 font-medium text-brand-gray-800 text-center md:mb-10">
              You group is successfully created
            </h4>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        className={`${
          step === 3 ? "w-full max-w-4xl" : "w-[500px] max-w-2xl max-h-[90vh]"
        } bg-card rounded-lg shadow-large mx-4 overflow-hidden p-6`}
      >
        {/* Header */}
        <div
          className={`flex items-center gap-6 mb-10 ${
            step === 3 && "justify-end !mb-0 md:!mb-10"
          }`}
        >
          {step === 2 && (
            <Icon
              name={"ChevronLeft"}
              size={24}
              className="text-brand-gray-800"
              onClick={() => setStep(1)}
            />
          )}
          {step !== 3 && (
            <h1 className="text-h5 font-medium text-brand-gray-800">
              {step === 1 ? "Create New Group" : "Select a members"}
            </h1>
          )}
          {step === 3 && (
            <Icon
              name={"X"}
              size={30}
              className="text-brand-gray-800 hover:cursor-pointer"
              onClick={onClose}
            />
          )}
        </div>

        {getContent()}

        {step !== 3 && (
          <div className="flex items-center justify-end gap-4 mt-5">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              // disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-10"
              onClick={step === 1 ? handleSumbit : handleAddClick}
              // loading={isLoading}
            >
              {step === 1 ? "Create" : "Add"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateGroupModal;
