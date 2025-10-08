import Modal from "components/ui/Modal";
import { mockUserData } from "../data";
import Image from "components/AppImage";

const NewMassageModal = ({ onClose, onNewConversation }) => {
  return (
    <Modal width="max-w-md w-full" title="Direct messages" onClose={onClose}>
      <div className="flex flex-col gap-4 h-[350px] overflow-y-scroll p-4">
        {mockUserData.map((user, index) => (
          <div
            key={index}
            className="flex items-center justify-between border-b border-[#E4E4E4] pb-4 cursor-pointer"
            onClick={() => {
              onNewConversation({
                name: user?.name,
                type: "direct",
                avatar: user?.image,
                lastMessage: "",
                lastSender: null,
                timestamp: new Date(Date.now() - 300000),
                unreadCount: 2,
                isOnline: true,
                isPriority: false,
                isTyping: false,
                participantCount: 2,
                isNewMessage: true,
              });
              onClose();
            }}
          >
            <div className="flex items-center gap-10">
              <Image
                src={user?.image}
                alt={user?.name}
                width={56} // for Next.js Image, must provide width & height
                height={56}
                className="w-14 h-14 rounded-full object-cover"
              />
              <h4 className="text-body1 font-medium text-brand-gray-800 hover:text-primary">
                {user?.name}
              </h4>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default NewMassageModal;
