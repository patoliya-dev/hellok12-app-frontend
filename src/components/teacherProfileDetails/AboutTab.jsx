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
            {teacher?.bio}
          </p>
        </div>
      </div>

      {/* Certificates Section */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Experience & Qualifications
        </h3>
        <div className="grid gap-4">
          {teacher?.certificates?.map((cert, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                <Icon name="Award" size={20} className="text-success" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-foreground">{cert?.name}</h4>
                  {cert?.verified && (
                    <Icon
                      name="CheckCircle"
                      size={16}
                      className="text-success"
                    />
                  )}
                </div>
                <p className="text-sm text-text-secondary mb-1">
                  {cert?.issuer}
                </p>
                <p className="text-xs text-text-secondary">{cert?.year}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Age Groups Section */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Age Groups I Teach
        </h3>
        <div className="flex flex-wrap gap-2">
          {teacher?.ageGroups?.map((ageGroup, index) => (
            <span
              key={index}
              className="px-3 py-2 bg-accent text-accent-foreground text-sm font-medium rounded-lg"
            >
              {ageGroup}
            </span>
          ))}
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
