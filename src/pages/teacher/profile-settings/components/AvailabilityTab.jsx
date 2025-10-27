import React, { useState } from "react";
import Button from "../../../../components/ui/Button";
import Input from "../../../../components/ui/Input";
import Select from "../../../../components/ui/Select";
import Icon from "../../../../components/AppIcon";
import { daysOfWeek, timeSlots, timezoneOptions } from "../data";

const AvailabilityTab = ({
  formData,
  onFormChange,
  onSave,
  isSaving,
  isEdit,
}) => {
  const handleInputChange = (field, value) => {
    onFormChange(field, value);
  };

  const getCurrentTime = (timeZone = "Asia/Kolkata") => {
    const now = new Date();
    return now.toLocaleTimeString("en-US", {
      hour12: true,
      hour: "numeric",
      minute: "2-digit",
      timeZone, // your selected timezone
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Globe" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">
            Timezone Settings
          </h3>
        </div>
        <div className="space-y-4">
          <Select
            label="Select Timezone"
            description="Choose your local timezone for accurate scheduling"
            options={timezoneOptions}
            value={formData.profile.timezone || ""}
            onChange={(value) => handleInputChange("profile.timezone", value)}
            searchable
            disabled={!isEdit}
          />

          <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="Clock" size={16} className="text-muted-foreground" />
              <span className="text-sm text-foreground">Current Time</span>
            </div>
            <span className="text-sm font-medium text-foreground">
              {getCurrentTime(formData?.profile?.timezone || "Asia/Kolkata")}
            </span>
          </div>

          {/* <Checkbox
            label="Automatic Daylight Saving Time"
            description="Automatically adjust for daylight saving time changes"
            checked={daylightSaving}
            onChange={(e) => onDaylightSavingChange(e?.target?.checked)}
          />

          {daylightSaving && (
            <div className="pl-6 border-l-2 border-primary/20">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="Info" size={14} />
                <span>
                  Your schedule will automatically adjust when daylight saving
                  time begins or ends
                </span>
              </div>
            </div>
          )} */}

          <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <Icon
                name="AlertTriangle"
                size={16}
                className="text-warning mt-0.5"
              />
              <div className="text-sm">
                <p className="text-foreground font-medium">Important Note</p>
                <p className="text-muted-foreground mt-1">
                  Students will see session times in their local timezone. Make
                  sure your timezone is correct to avoid scheduling conflicts.
                </p>
              </div>
            </div>
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
          Save Availability
        </Button>
      </div>
    </div>
  );
};

export default AvailabilityTab;
