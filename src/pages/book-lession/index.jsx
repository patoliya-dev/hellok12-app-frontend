import RoleBasedHeader from "../../components/ui/RoleBasedHeader";

const BookLession = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <RoleBasedHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pb-8">
        <section>
          <h1 className="text-foreground font-bold text-h3 mb-2">
            Book Your Lessons
          </h1>
          <p className="text-muted-foreground">
            Complete your booking in a few simple steps. All fields marked with
            * are required.
          </p>
        </section>
      </main>
    </div>
  );
};

export default BookLession;
