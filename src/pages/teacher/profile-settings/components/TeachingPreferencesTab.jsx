import { useSelector } from "react-redux";
import React, { useState } from "react";
import Button from "../../../../components/ui/Button";
import Input from "../../../../components/ui/Input";
import { Checkbox } from "../../../../components/ui/Checkbox";
import Icon from "../../../../components/AppIcon";
import { selectAuthUser } from "features/auth/authSelectors";

const TeachingPreferencesTab = ({
  formData,
  onFormChange,
  onSave,
  isSaving,
  isEdit,
}) => {
  const user = useSelector(selectAuthUser);
  const [showTravelRadius, setShowTravelRadius] = useState(
    formData?.inPersonTeaching || false
  );

  const handleInputChange = (field, value) => {
    const updatedData = { ...formData, [field]: value };
    onFormChange(updatedData);
  };

  const handleTeachingModeChange = (mode, isEnabled) => {
    if (mode === "inPersonTeaching") {
      setShowTravelRadius(isEnabled);
      if (!isEnabled) {
        handleInputChange("travelRadius", "");
      }
    }
    handleInputChange(mode, isEnabled);
  };

  const formatCurrency = (value) => {
    if (!value) return "";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })?.format(value);
  };

  const handleRateChange = (field, value) => {
    // Remove non-numeric characters except decimal point
    const numericValue = value?.replace(/[^0-9.]/g, "");
    handleInputChange(field, numericValue);
  };

  return (
    <div className="space-y-6">
      {/* Teaching Modes */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Teaching Modes
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Select how you prefer to conduct your lessons. You can choose both
          options.
        </p>

        <div className="space-y-4">
          <div className="flex items-start space-x-4 p-4 border border-border rounded-lg">
            <Checkbox
              checked={formData?.onlineTeaching || false}
              onChange={(e) =>
                handleTeachingModeChange("onlineTeaching", e?.target?.checked)
              }
              disabled={!isEdit}
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Video" size={20} className="text-primary" />
                <h4 className="text-md font-medium text-foreground">
                  Online Teaching
                </h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Conduct lessons via video calls using platforms like Zoom,
                Skype, or Google Meet
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 border border-border rounded-lg">
            <Checkbox
              checked={formData?.inPersonTeaching || false}
              onChange={(e) =>
                handleTeachingModeChange("inPersonTeaching", e?.target?.checked)
              }
              disabled={!isEdit}
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="MapPin" size={20} className="text-primary" />
                <h4 className="text-md font-medium text-foreground">
                  In-Person Teaching
                </h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Meet students face-to-face at their location, your location, or
                a public space
              </p>
            </div>
          </div>
        </div>

        {/* Travel Radius (conditional) */}
        {showTravelRadius && (
          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
            <h4 className="text-md font-medium text-foreground mb-4">
              Travel Preferences
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Travel Radius (miles)
                </label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={formData?.travelRadius || 10}
                  onChange={(e) =>
                    handleInputChange("travelRadius", e?.target?.value)
                  }
                  disabled={!isEdit}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>1 mile</span>
                  <span className="font-medium text-foreground">
                    {formData?.travelRadius || 10} miles
                  </span>
                  <span>50 miles</span>
                </div>
              </div>
              <Input
                label="Additional Travel Fee"
                type="text"
                placeholder="$0"
                description="Extra fee for traveling to student's location"
                value={
                  formData?.travelFee ? formatCurrency(formData?.travelFee) : ""
                }
                onChange={(e) =>
                  handleRateChange("travelFee", e?.target?.value)
                }
                disabled={!isEdit}
              />
            </div>
          </div>
        )}
      </div>
      {/* Pricing */}
      {user?.type === "independent" && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Lesson Rates
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            Set your hourly rates for different types of lessons. All prices are
            in USD.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-md font-medium text-foreground">
                Individual Lessons
              </h4>
              <Input
                label="Trial Lesson Rate"
                type="text"
                placeholder="$25"
                description="Discounted rate for first-time students"
                value={
                  formData?.trialRate ? formatCurrency(formData?.trialRate) : ""
                }
                onChange={(e) =>
                  handleRateChange("trialRate", e?.target?.value)
                }
                required
                disabled={!isEdit}
              />
              <Input
                label="Regular Lesson Rate"
                type="text"
                placeholder="$40"
                description="Standard hourly rate for individual lessons"
                value={
                  formData?.regularRate
                    ? formatCurrency(formData?.regularRate)
                    : ""
                }
                onChange={(e) =>
                  handleRateChange("regularRate", e?.target?.value)
                }
                required
                disabled={!isEdit}
              />
            </div>

            <div className="space-y-4">
              <h4 className="text-md font-medium text-foreground">
                Group Lessons
              </h4>
              <Input
                label="Group Lesson Rate"
                type="text"
                placeholder="$25"
                description="Per person rate for group lessons (2-4 students)"
                value={
                  formData?.groupRate ? formatCurrency(formData?.groupRate) : ""
                }
                onChange={(e) =>
                  handleRateChange("groupRate", e?.target?.value)
                }
                disabled={!isEdit}
              />
              <Input
                label="Package Discount (%)"
                type="number"
                placeholder="10"
                min="0"
                max="50"
                description="Discount for lesson packages (5+ lessons)"
                value={formData?.packageDiscount || ""}
                onChange={(e) =>
                  handleInputChange("packageDiscount", e?.target?.value)
                }
                disabled={!isEdit}
              />
            </div>
          </div>
        </div>
      )}
      {/* Additional Preferences */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Additional Preferences
        </h3>

        <div className="space-y-4">
          <Input
            label="Maximum Students Per Group"
            type="number"
            placeholder="6"
            min="2"
            max="20"
            description="Maximum number of students in group lessons"
            value={formData?.maxGroupSize || ""}
            onChange={(e) =>
              handleInputChange("maxGroupSize", e?.target?.value)
            }
            disabled={!isEdit}
          />

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Special Requirements or Notes
            </label>
            <textarea
              className="w-full min-h-[80px] px-3 py-2 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Any special requirements, equipment needed, or additional notes for students..."
              value={formData?.specialRequirements || ""}
              onChange={(e) =>
                handleInputChange("specialRequirements", e?.target?.value)
              }
              disabled={!isEdit}
            />
          </div>
        </div>
      </div>
      {/* Save Button */}
      <div className="flex justify-end pt-4 border-t border-border">
        <Button
          variant="default"
          onClick={onSave}
          loading={isSaving}
          iconName="Save"
          iconPosition="left"
        >
          Save Teaching Preferences
        </Button>
      </div>
    </div>
  );
};

export default TeachingPreferencesTab;
