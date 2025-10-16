// PageHeader.jsx
import React from "react";
import Button from "./Button";

const PageHeader = ({
  title,
  description,
  isButton = false,
  buttonTitle,
  onButtonClick,
  ...props
}) => {
  return (
    <section className="my-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4 sm:gap-0">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">{title}</h1>
          {description && <p className="text-brand-gray-500">{description}</p>}
        </div>
        {isButton && (
          <Button {...props} onClick={onButtonClick}>
            {buttonTitle}
          </Button>
        )}
      </div>
    </section>
  );
};

export default PageHeader;
