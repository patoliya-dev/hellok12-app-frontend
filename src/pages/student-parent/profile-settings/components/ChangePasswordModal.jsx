import React, { useState } from 'react';
import Button from 'components/ui/Button';
import Input from 'components/ui/Input';
import Icon from 'components/AppIcon';

const ChangePasswordModal = ({ onClose }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('accessToken'); // or from redux store
      // const response = await fetch('/api/change-password', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     Authorization: `Bearer ${token}`,
      //   },
      //   body: JSON.stringify({
      //     oldPassword,
      //     newPassword,
      //   }),
      // });

      // if (!response.ok) {
      //   const data = await response.json();
      //   throw new Error(data.message || 'Failed to change password');
      // }

      setLoading(false);
      setSuccess(true);
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  if (success) {
    return (
      <div className="max-w-sm mx-auto bg-white rounded-xl border border-border shadow-lg p-8 flex flex-col items-center">
        <button className="mb-6 flex items-center gap-1 text-sm text-muted-foreground self-start" onClick={onClose}>
          <Icon name="ArrowLeft" size={16} />
          Back to Profile
        </button>
        <div className="rounded-full bg-blue-100 p-4 mb-6">
          <Icon name="Check" size={48} color="#2563EB" />
        </div>
        <div className="text-center text-xl font-medium text-foreground mb-2">
          Your password is successfully<br />changed
        </div>
      </div>
    );
  }

  return (
    <form className="max-w-sm mx-auto bg-white rounded-xl border border-border shadow-lg p-8" onSubmit={handleSubmit}>
      <button type="button" className="mb-6 flex items-center gap-1 text-sm text-muted-foreground" onClick={onClose}>
        <Icon name="ArrowLeft" size={16} />
        Back to Profile
      </button>
      <div className="text-2xl font-bold text-foreground mb-2">Set a new password</div>
      <div className="text-text-secondary mb-6 text-sm">Please set a new password for your account.</div>

      {error && <p className="text-sm text-destructive mb-4">{error}</p>}

      <div className="space-y-5">
        <Input
          type={showOld ? 'text' : 'password'}
          label="Enter old Password"
          required
          placeholder="Enter old previous password"
          value={oldPassword}
          onChange={e => setOldPassword(e.target.value)}
          endAdornment={
            <button type="button" tabIndex={-1} onClick={() => setShowOld(s => !s)}>
              <Icon name={showOld ? 'EyeOff' : 'Eye'} size={18} />
            </button>
          }
        />
        <Input
          type={showNew ? 'text' : 'password'}
          label="Create new Password"
          required
          placeholder="Enter New Password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          endAdornment={
            <button type="button" tabIndex={-1} onClick={() => setShowNew(s => !s)}>
              <Icon name={showNew ? 'EyeOff' : 'Eye'} size={18} />
            </button>
          }
        />
      </div>

      <Button type="submit" variant="default" size="lg" className="mt-8 w-full" loading={loading}>Set password</Button>
    </form>
  );
};

export default ChangePasswordModal;
