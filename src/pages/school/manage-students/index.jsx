import { useEffect, useState } from "react";
import Button from "../../../components/ui/Button";
import RoleBasedHeader from "../../../components/ui/RoleBasedHeader";
import Card from "../dashboard/components/Card";
import { cardData, mockStudents } from "./data";
import PageHeader from "../../../components/ui/PageHeader";
import Filters from "./components/Filters";
import Studentsection from "./components/StudentSection";
import StudentProfile from "./components/StudentProfile";
import Icon from "../../../components/AppIcon";
import ProfileRequestModal from "./components/ProfileRequestModal";
import { successToast } from "../../../utils/utils";
import InviteStudentModal from "./components/InviteStudentModal";
import SearchBar from "../../../components/ui/SearchBar";

const ManageStudents = () => {
  const [students, setStudents] = useState(mockStudents);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showProfileRequestModal, setShowProfileRequestModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [filters, setFilters] = useState({
    status: "all",
  });
  const studentsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  // Filter students based on current filters and search term
  const filteredStudents = students?.filter((student) => {
    // Search filter
    const matchesSearch =
      searchTerm === "" ||
      student?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      student?.email?.toLowerCase()?.includes(searchTerm?.toLowerCase());

    const matchesStatus =
      filters?.status === "all" || student?.status === filters?.status;

    // Filter type (all or school students)
    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "school" && student?.isSchoolStudent);

    return matchesSearch && matchesStatus && matchesFilter;
  });

  // Pagination
  const totalPages = Math.ceil(filteredStudents?.length / studentsPerPage);
  const startIndex = (currentPage - 1) * studentsPerPage;
  const paginatedStudents = filteredStudents?.slice(
    startIndex,
    startIndex + studentsPerPage
  );
  const handleStudentselect = (student) => {
    setSelectedStudent(student);
  };

  const handleStatusChange = (studentId, action) => {
    let newStatus;
    switch (action) {
      case "approve":
        newStatus = "active";
        break;
      case "reject":
        newStatus = "inactive";
        break;
      default:
        return;
    }

    setStudents((prev) =>
      prev?.map((student) =>
        student?.id === studentId ? { ...student, status: newStatus } : student
      )
    );

    successToast("Student status updated successfully!");
  };

  const handleInviteModalOpen = () => {
    setShowInviteModal(!showInviteModal);
  };

  const handleInviteStudent = (inviteData) => {
    const newStudent = {
      id: students?.length + 1,
      name: inviteData?.name,
      email: inviteData?.email,
      phone: "",
      address: "",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      status: inviteData?.setAsActive ? "active" : "pending",
      languages: inviteData?.languages,
      location: "Location TBD",
      experience: 0,
      isOnline: false,
      travelDistance: 10,
      hourlyRate: 35,
      availability: {
        onsite: false,
        online: false,
      },
      bio: "New student - profile setup pending",
      stats: {
        totalLessons: 0,
        totalStudents: 0,
        rating: 0,
        totalEarnings: 0,
      },
      joinedDate: new Date()?.toISOString()?.split("T")?.[0],
    };

    setStudents((prev) => [newStudent, ...prev]);
  };

  const handleSuccessModal = () => {
    setShowSuccessModal(!showSuccessModal);
  };

  const handleProfileRequestModal = () => {
    setShowProfileRequestModal(!showProfileRequestModal);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <RoleBasedHeader />

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pb-8">
        <PageHeader
          title="Manage Students"
          description={"Manage your students and handle student invitations"}
          isButton
          iconName="UserPlus"
          buttonTitle="Invite Student"
          onButtonClick={handleInviteModalOpen}
          studentCount={filteredStudents?.length}
        />
        <div className="flex items-center justify-between gap-4 mb-10">
          <div className="w-[59%]">
            <SearchBar onSearch={handleSearch} />
          </div>
          <div className="flex gap-2">
            <Button
              variant={activeFilter === "all" ? "default" : "outline"}
              onClick={() => handleFilterChange("all")}
              className="px-6"
            >
              All
            </Button>
            <Button
              variant={activeFilter === "school" ? "default" : "outline"}
              onClick={() => handleFilterChange("school")}
              className="px-6"
            >
              School Students
            </Button>
          </div>
        </div>
        <section className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-6">
          {/* Left Section - Student List */}
          <div className="">
            <Studentsection
              studentData={paginatedStudents}
              studentCount={filteredStudents?.length}
              selectedStudent={selectedStudent}
              onSelect={handleStudentselect}
              onStatusChange={handleStatusChange}
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredStudents?.length}
              onPageChange={(page) => setCurrentPage(page)}
              pageSize={studentsPerPage}
              onInviteStudent={handleInviteModalOpen}
              onProfileRequest={handleProfileRequestModal}
            />
          </div>
          {/* Right Section - Student Profile */}
          <div>
            <div className="bg-card border border-border rounded-lg h-[600px]">
              <StudentProfile
                student={selectedStudent}
                onClose={() => setSelectedStudent(null)}
              />
            </div>
          </div>
        </section>
      </main>

      <InviteStudentModal
        isOpen={showInviteModal}
        onClose={handleInviteModalOpen}
        onInvite={handleInviteStudent}
        onSuccess={handleSuccessModal}
      />

      <ProfileRequestModal
        isOpen={showProfileRequestModal}
        onClose={handleProfileRequestModal}
      />

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-200 p-4">
          <div className="bg-card rounded-lg max-w-md text-center shadow-elevation-3 p-4">
            <div className="flex justify-end">
              <Icon
                name={"X"}
                size={30}
                className="text-brand-gray-800 hover:cursor-pointer"
                onClick={handleSuccessModal}
              />
            </div>
            <div className="flex flex-col items-center gap-8">
              <div className="w-28 h-28 bg-primary rounded-full flex items-center justify-center mx-auto">
                <Icon name="Check" size={64} color="white" />
              </div>
              <p className="text-h4 font-medium text-brand-gray-800 px-10 mb-6">
                Your invitation was sent successfully
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStudents;
