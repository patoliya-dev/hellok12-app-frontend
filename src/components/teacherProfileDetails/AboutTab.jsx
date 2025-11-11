import React from "react";
import Icon from "../ui/Icon";

const AboutTab = ({ teacher }) => {
  return (
    <div className="space-y-8">
      {/* Bio Section */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">About Me</h3>
        <div className="prose prose-sm max-w-none">
          <p className="text-text-secondary leading-relaxed whitespace-pre-line">
            {teacher?.profile?.aboutYou}
          </p>
        </div>
      </div>

      <div className="flex items-start justify-between gap-10">
        {/* Certificates Section */}
        <div className="w-[50%] flex flex-col gap-4">
          {teacher?.profile?.highestEducation && (
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Experience & Qualifications
              </h3>
              <div className="grid gap-4">
                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                  <div className="flex-shrink-0 w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                    <Icon name="Award" size={20} className="text-success" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-foreground">
                        {teacher?.profile?.highestEducation}
                      </h4>
                    </div>
                    <p className="text-sm text-text-secondary mb-1">
                      {teacher?.profile?.institution}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {teacher?.profile?.graduationYear}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          {teacher?.profile?.ageGroupTeach &&
            teacher?.profile?.ageGroupTeach.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Age Groups I Teach
                </h3>
                <div className="flex flex-wrap gap-2">
                  {teacher?.profile?.ageGroupTeach?.map((ageGroup, index) => (
                    <span
                      key={index}
                      className="px-3 py-2 bg-[#f59e0b]/10 text-[#f59e0b] text-sm font-medium rounded-lg"
                    >
                      {ageGroup}
                    </span>
                  ))}
                </div>
              </div>
            )}
        </div>
        <div className="w-[50%]">
          {/* teaching styles */}
          {teacher?.profile?.teachingStyle && (
            <div className="w-96">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Teaching Styles
              </h3>
              <div className="flex flex-wrap gap-2">
                <span className="text-text-secondary text-sm font-medium">
                  {teacher?.profile?.teachingStyle}
                </span>
              </div>
            </div>
          )}
          {/* Why I love teaching */}
          {teacher?.profile?.whyTeaching && (
            <div className="w-96 mt-5">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Why I Love Teaching
              </h3>
              <div className="prose prose-sm max-w-none">
                <p className="text-text-secondary text-sm font-medium">
                  {teacher?.profile?.whyTeaching}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Teaching Experience */}
      {/* <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Teaching Experience</h3>
        <div className="space-y-4">
          {teacher?.teachingExperience?.map((exp, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2" />
              <div>
                <h4 className="font-medium text-foreground">{exp?.position}</h4>
                <p className="text-sm text-text-secondary">{exp?.institution}</p>
                <p className="text-xs text-text-secondary">{exp?.duration}</p>
                {exp?.description && (
                  <p className="text-sm text-text-secondary mt-1">{exp?.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div> */}

      {/* Specializations */}
      {/* <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Specializations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {teacher?.specializations?.map((spec, index) => (
            <div key={index} className="flex items-center gap-2 p-3 bg-accent/10 rounded-lg">
              <Icon name="CheckCircle" size={16} className="text-accent" />
              <span className="text-sm font-medium text-foreground">{spec}</span>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default AboutTab;
