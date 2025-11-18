import { useEffect, useState } from "react";
import Modal from "components/ui/Modal";
import Image from "components/AppImage";
import Loader from "components/ui/Loader";
import {
  createThread,
  listTeachers,
} from "../../../../services/messages/message.service";

const NewMessageModal = ({ onClose, onNewConversation, currentUser }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const data = await listTeachers();
        setUsers(data);
      } catch (err) {
        console.error("Failed to load users", err);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleNewMessage = async (userId) => {
    try {
      setCreating(true);
      const data = await createThread({
        userId: currentUser?.id,
        threadType: "DIRECT",
        participants: [currentUser?.id, userId],
      });
      onNewConversation(data);
      onClose();
    } catch (error) {
      console.error("Failed to create thread:", error);
    } finally {
      setCreating(false);
    }
  };

  return (
    <Modal width="max-w-md w-full" title="Direct messages" onClose={onClose}>
      {loading ? (
        <div className="flex justify-center items-center h-[350px]">
          <Loader />
        </div>
      ) : (
        <div className="flex flex-col gap-4 h-[350px] overflow-y-scroll p-4">
          {users.length === 0 ? (
            <div className="flex justify-center items-center h-full text-muted-foreground">
              No teachers available
            </div>
          ) : (
            users.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between border-b border-[#E4E4E4] pb-4 cursor-pointer hover:bg-muted/50 transition-colors rounded-lg p-2"
                onClick={() => !creating && handleNewMessage(user._id)}
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={
                      user?.profileImage?.url || "/assets/images/no_image.png"
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
                {creating && (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </Modal>
  );
};

export default NewMessageModal;
