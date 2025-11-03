import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Button from "components/ui/Button";
import Input from "components/ui/Input";
import Icon from "components/AppIcon";
import { changePassword as changePasswordThunk } from "../../../../reducers/auth/authThunks";

const ChangePasswordModal = ({ onClose }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await dispatch(
        changePasswordThunk({ oldPassword, newPassword })
      );
      if (changePasswordThunk.fulfilled.match(result)) {
        setLoading(false);
        setSuccess(true);
      } else {
        // Handles rejected
        setLoading(false);
        setError(result.payload || "Failed to change password");
      }
    } catch (err) {
      setLoading(false);
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to change password"
      );
    }
  };

  if (success) {
    return (
      <div className="max-w-sm mx-auto bg-white rounded-xl border border-border shadow-lg p-8 flex flex-col items-center">
        <button
          className="mb-6 flex items-center gap-1 text-sm text-muted-foreground self-start"
          onClick={onClose}
        >
          <Icon name="ArrowLeft" size={16} />
          Back to Profile
        </button>
        <div className="rounded-full bg-blue-100 p-4 mb-6">
          <Icon name="Check" size={48} color="#2563EB" />
        </div>
        <div className="text-center text-xl font-medium text-foreground mb-2">
          Your password is successfully
          <br />
          changed
        </div>
      </div>
    );
  }

  return (
    <form
      className="max-w-sm mx-auto bg-white rounded-xl border border-border shadow-lg p-8"
      onSubmit={handleSubmit}
    >
      <button
        type="button"
        className="mb-6 flex items-center gap-1 text-sm text-muted-foreground"
        onClick={onClose}
      >
        <Icon name="ArrowLeft" size={16} />
        Back to Profile
      </button>
      <div className="text-2xl font-bold text-foreground mb-2">
        Set a new password
      </div>
      <div className="text-text-secondary mb-6 text-sm">
        Please set a new password for your account.
      </div>

      {error && <p className="text-sm text-destructive mb-4">{error}</p>}

      <div className="space-y-5">
        <Input
          type={"password"}
          label="Enter old Password"
          required
          placeholder="Enter old previous password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <Input
          type={"password"}
          label="Create new Password"
          required
          placeholder="Enter New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>

      <Button
        type="submit"
        variant="default"
        size="lg"
        className="mt-8 w-full"
        loading={loading}
      >
        Set password
      </Button>
    </form>
  );
};

export default ChangePasswordModal;
