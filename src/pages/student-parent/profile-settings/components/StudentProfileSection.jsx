import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import Input from 'components/ui/Input';
import Select from 'components/ui/Select';
import Button from 'components/ui/Button';

const GENDER_OPTIONS = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
  { label: 'Other', value: 'Other' },
];

const LANGUAGE_OPTIONS = [
  { label: 'English', value: 'English' },
  { label: 'Spanish', value: 'Spanish' },
  { label: 'French', value: 'French' },
  { label: 'German', value: 'German' },
  { label: 'Chinese', value: 'Chinese' },
  { label: 'Japanese', value: 'Japanese' },
];

const StudentProfileSection = ({ isExpanded, onToggle, profileData, onSave, onChangePasswordClick }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profileData || {});

  useEffect(() => {
    setFormData(profileData || {});
    setIsEditing(false);
  }, [profileData]);

  const languagesArray = formData.languages ? formData.languages.split(',').map(l => l.trim()) : [];

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenderChange = value => setFormData(prev => ({ ...prev, gender: value }));
  const handleLanguagesChange = values => setFormData(prev => ({ ...prev, languages: values.join(', ') }));

  const handleSave = () => {
    onSave(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(profileData || {});
    setIsEditing(false);
  };

  return (
    <section className="w-full mb-5 bg-card border border-border rounded-sm shadow-sm">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center space-x-3">
          <Icon name="User" size={20} className="text-primary" />
          <h2 className="font-semibold text-lg text-foreground">Personal Information</h2>
        </div>
        <Icon name="ChevronDown" size={20} className={isExpanded ? 'rotate-180' : 'rotate-0'} />

      </button>

      {isExpanded && (
        <div className="p-6">
          <div className="flex justify-between py-4">
            <p> Manage your personal information and profile details</p>
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                iconName="Edit"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-6 mb-6">
            <img
              src={formData.profileImage}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover bg-muted"
            />
          </div>

          {isEditing ? (
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
              <Input label="Full Name" name="fullName" value={formData.fullName || ''} onChange={handleChange} />
              <Input label="Phone Number" name="phone" value={formData.phone || ''} onChange={handleChange} />
              <Input label="Email Address" name="email" type="email" value={formData.email || ''} onChange={handleChange} />
              <Input label="Address" name="address" value={formData.address || ''} onChange={handleChange} className="md:col-span-2" />
              <Input label="Age" name="age" type="number" value={formData.age || ''} onChange={handleChange} />
              <Select label="Gender" options={GENDER_OPTIONS} value={formData.gender || ''} onChange={handleGenderChange} />
              <Select label="Languages" options={LANGUAGE_OPTIONS} multiple value={languagesArray} onChange={handleLanguagesChange} />
              <div className="md:col-span-2 flex justify-end space-x-4 pt-4">
                <Button variant="ghost" onClick={handleCancel} size="sm">Cancel</Button>
                <Button type="submit" variant="default" size="sm">Save Changes</Button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-muted-foreground">Full Name</label>
                <p className="mt-1 text-sm text-foreground">{formData.fullName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground">Phone Number</label>
                <p className="mt-1 text-sm text-foreground">{formData.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground">Email Address</label>
                <p className="mt-1 text-sm text-foreground">{formData.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground">Address</label>
                <p className="mt-1 text-sm text-foreground">{formData.address}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground">Age</label>
                <p className="mt-1 text-sm text-foreground">{formData.age}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground">Gender</label>
                <p className="mt-1 text-sm text-foreground">{formData.gender}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground">Languages</label>
                <p className="mt-1 text-sm text-foreground">{formData.languages}</p>
              </div>
            </div>
          )}

          <div className="mt-6">
            <Button variant="link" onClick={onChangePasswordClick}>Change Password</Button>
          </div>
        </div>
      )}
    </section>
  );
};

export default StudentProfileSection;
