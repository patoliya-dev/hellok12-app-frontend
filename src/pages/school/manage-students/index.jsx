import { useEffect, useState } from "react";
import Button from "components/ui/Button";
import RoleBasedHeader from "components/ui/RoleBasedHeader";
import Card from "../dashboard/components/Card";
import { cardData, mockTeachers, teachersPerPage } from "./data";
import PageHeader from "components/ui/PageHeader";
import Filters from "./components/Filters";
import TeacherSection from "./components/TeacherSection";
import TeacherProfile from "./components/TeacherProfile";
import Icon from "components/AppIcon";
import ProfileRequestModal from "./components/ProfileRequestModal";
import { successToast } from "../../../utils/utils";
import InviteStudentModal from "./components/InviteStudentModal";

const ManageStudents = () => {
  const [teachers, setTeachers] = useState(mockTeachers);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showProfileRequestModal, setShowProfileRequestModal] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    language: "",
    availability: "all",
    experience: "all",
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleFilterChange = (field, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value,
    }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      status: "all",
      language: "",
      availability: "all",
      experience: "all",
    });
    setCurrentPage(1);
  };

  // Filter teachers based on current filters
  const filteredTeachers = teachers?.filter((teacher) => {
    const matchesStatus =
      filters?.status === "all" || teacher?.status === filters?.status;

    const matchesLanguage =
      filters?.language === "" ||
      teacher?.languages?.some((lang) =>
        lang?.toLowerCase()?.includes(filters?.language?.toLowerCase())
      );

    const matchesTeachingMethod =
      filters?.availability === "all" ||
      (filters?.availability === "onsite" &&
        teacher?.availability?.onsite &&
        !teacher?.availability?.online) ||
      (filters?.availability === "online" &&
        teacher?.availability?.online &&
        !teacher?.availability?.onsite) ||
      (filters?.availability === "both" &&
        teacher?.availability?.onsite &&
        teacher?.availability?.online);

    const matchesExperience =
      filters?.experience === "all" ||
      (filters?.experience === "0-2" && teacher?.experience <= 2) ||
      (filters?.experience === "3-5" &&
        teacher?.experience >= 3 &&
        teacher?.experience <= 5) ||
      (filters?.experience === "5+" && teacher?.experience > 5);

    return (
      matchesStatus &&
      matchesLanguage &&
      matchesTeachingMethod &&
      matchesExperience
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredTeachers?.length / teachersPerPage);
  const startIndex = (currentPage - 1) * teachersPerPage;
  const paginatedTeachers = filteredTeachers?.slice(
    startIndex,
    startIndex + teachersPerPage
  );

  const handleTeacherSelect = (teacher) => {
    setSelectedTeacher(teacher);
  };

  const handleStatusChange = (teacherId, action) => {
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

    setTeachers((prev) =>
      prev?.map((teacher) =>
        teacher?.id === teacherId ? { ...teacher, status: newStatus } : teacher
      )
    );

    successToast("Teacher status updated successfully!");
  };

  const handleInviteModalOpen = () => {
    setShowInviteModal(!showInviteModal);
  };

  const handleInviteTeacher = (inviteData) => {
    const newTeacher = {
      id: teachers?.length + 1,
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
      bio: "New teacher - profile setup pending",
      stats: {
        totalLessons: 0,
        totalStudents: 0,
        rating: 0,
        totalEarnings: 0,
      },
      joinedDate: new Date()?.toISOString()?.split("T")?.[0],
    };

    setTeachers((prev) => [newTeacher, ...prev]);
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
          studentCount={filteredTeachers?.length}
        />
        <section className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-6">
          {/* Left Section - Teacher List */}
          <div className="">
            <TeacherSection
              teacherData={paginatedTeachers}
              teacherCount={filteredTeachers?.length}
              selectedTeacher={selectedTeacher}
              onSelect={handleTeacherSelect}
              onStatusChange={handleStatusChange}
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredTeachers?.length}
              onPageChange={(page) => setCurrentPage(page)}
              pageSize={teachersPerPage}
              onInviteTeacher={handleInviteModalOpen}
              onProfileRequest={handleProfileRequestModal}
            />
          </div>
          {/* Right Section - Teacher Profile */}
          <div>
            <div className="bg-card border border-border rounded-lg h-[800px]">
              <TeacherProfile
                teacher={selectedTeacher}
                onClose={() => setSelectedTeacher(null)}
              />
            </div>
          </div>
        </section>
      </main>

      <InviteStudentModal
        isOpen={showInviteModal}
        onClose={handleInviteModalOpen}
        onInvite={handleInviteTeacher}
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
