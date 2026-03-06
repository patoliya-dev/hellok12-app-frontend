import { useEffect, useState, useCallback } from "react";
import Button from "../../../components/ui/Button";
import RoleBasedHeader from "../../../components/ui/RoleBasedHeader";
import PageHeader from "../../../components/ui/PageHeader";
import Studentsection from "./components/StudentSection";
import StudentProfile from "./components/StudentProfile";
import Icon from "../../../components/AppIcon";
import ProfileRequestModal from "./components/ProfileRequestModal";
import { successToast, errorToast } from "../../../utils/utils";
import InviteStudentModal from "./components/InviteStudentModal";
import SearchBar from "../../../components/ui/SearchBar";
import { schoolService } from "../../../services/school/school.service";
import Loader from "../../../components/ui/Loader";

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1,
  });
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

  // Fetch students from API
  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const response = await schoolService.getStudents({
        page: currentPage,
        limit: studentsPerPage,
        search: searchTerm || undefined,
        status: filters.status !== "all" ? filters.status : undefined,
      });

      // Transform API response to match component format
      const transformedStudents = (response.students || []).map((student) => ({
        id: student._id,
        _id: student._id,
        name: student.name,
        email: student.email,
        phone: student.profile?.phone || "",
        address: student.profile?.address || "",
        avatar: student.profileImage?.url || "",
        status: student.status,
        languages: student.profile?.languages || [],
        age: student.profile?.age || "",
        gender: student.profile?.gender || "",
        createdAt: student.createdAt,
        updatedAt: student.updatedAt,
        isSchoolStudent: true, // Assuming all fetched students are school students
      }));

      setStudents(transformedStudents);
      setPagination(
        response.pagination || {
          total: transformedStudents.length,
          page: currentPage,
          limit: studentsPerPage,
          pages: Math.ceil(transformedStudents.length / studentsPerPage),
        }
      );
    } catch (error) {
      console.error("Failed to fetch students:", error);
      errorToast(error?.message || "Failed to fetch students");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, filters.status]);

  // Fetch students when dependencies change
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Reset to first page when search term changes
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchTerm]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  // Filter students client-side for "school students" filter
  const filteredStudents =
    activeFilter === "all"
      ? students
      : students.filter((student) => student.isSchoolStudent);

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
        student?.id === studentId || student?._id === studentId
          ? { ...student, status: newStatus }
          : student
      )
    );

    successToast("Student status updated successfully!");
  };

  const handleInviteModalOpen = () => {
    setShowInviteModal(!showInviteModal);
  };

  const handleSuccessModal = () => {
    setShowSuccessModal(!showSuccessModal);
    // Refresh students list after successful invite
    fetchStudents();
  };

  const handleProfileRequestModal = () => {
    setShowProfileRequestModal(!showProfileRequestModal);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
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
          studentCount={pagination.total}
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
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader />
          </div>
        ) : (
          <section className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-6">
            {/* Left Section - Student List */}
            <div className="">
              <Studentsection
                studentData={filteredStudents}
                studentCount={pagination.total}
                selectedStudent={selectedStudent}
                onSelect={handleStudentselect}
                onStatusChange={handleStatusChange}
                currentPage={pagination.page || currentPage}
                totalPages={pagination.pages || 1}
                totalItems={pagination.total}
                onPageChange={handlePageChange}
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
        )}
      </main>

      <InviteStudentModal
        isOpen={showInviteModal}
        onClose={handleInviteModalOpen}
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
