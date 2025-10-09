// PageHeader.jsx
import React from "react";

const PageHeader = ({ title, description }) => {
  return (
    <section className="my-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            {title}
          </h1>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default PageHeader;
