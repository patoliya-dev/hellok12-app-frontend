import Icon from "../../../components/AppIcon";

const CommonStepper = ({ stepperContent, currentStep }) => {
  const totalLength = stepperContent?.length;

  return (
    <section className="my-7">
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4 border border-primary/20 w-full max-w-[820px] shadow-[0_4px_6px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0">
          {stepperContent?.map((step, index) => (
            <div
              key={step.id}
              className="flex items-center flex-1 md:flex-none"
            >
              {/* Circle */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0 transition-smooth ${
                  step?.id === currentStep
                    ? "bg-primary text-primary-foreground"
                    : step?.id <= currentStep
                    ? "bg-success text-success-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {step?.id < currentStep ? (
                  <Icon name="Check" size={16} />
                ) : (
                  <span className="text-body2 font-medium">{step?.id}</span>
                )}
              </div>

              {/* Title */}
              <span
                className={`ml-2 text-body2 font-medium truncate ${
                  step?.id === currentStep
                    ? "text-primary"
                    : step?.id <= currentStep
                    ? "text-success"
                    : "text-muted-foreground"
                } `}
              >
                {step?.title}
              </span>

              {/* Connector */}
              {index < totalLength - 1 && (
                <div
                  className={`md:w-40 lg:w-52 h-0.5 mx-2 transition-smooth hidden sm:block ${
                    step?.id < currentStep ? "bg-success" : "bg-slate-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommonStepper;
