import { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import Button from "../../../components/ui/Button";
import RoleBasedHeader from "../../../components/ui/RoleBasedHeader";
import PageHeader from "../../../components/ui/PageHeader";
import Studentsection from "./components/StudentSection";
import StudentProfile from "./components/StudentProfile";
import Icon from "../../../components/AppIcon";
import ProfileRequestModal from "./components/ProfileRequestModal";
import InviteStudentModal from "./components/InviteStudentModal";
import SearchBar from "../../../components/ui/SearchBar";
import Loader from "../../../components/ui/Loader";
import { successToast, errorToast } from "../../../utils/utils";

import { fetchSchoolStudents } from "reducers/school/schoolThunks";
import {
  selectSchoolStudents,
  selectSchoolStudentsPagination,
  selectSchoolReq,
} from "reducers/school/schoolSlice";

import InvitationTable from "../components/InvitationTable";
import {
  fetchSchoolInvitations,
  cancelSchoolInvitation,
} from "reducers/schoolInvitations/schoolInvitationsThunks";
import {
  selectInvitations,
  selectInvitationsLoading,
  selectInvitationsPagination,
} from "reducers/schoolInvitations/schoolInvitationsSlice";

const studentsPerPage = 10;
const invPageSize = 10;

const ManageStudents = () => {
  const dispatch = useDispatch();

  const rawStudents = useSelector(selectSchoolStudents);
  const pagination = useSelector(selectSchoolStudentsPagination);
  const fetchReq = useSelector(selectSchoolReq("fetchSchoolStudents"));
  const loading = fetchReq.status === "loading";

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showProfileRequestModal, setShowProfileRequestModal] = useState(false);

  const [activeFilter, setActiveFilter] = useState("all");
  const [filters] = useState({ status: "all" }); // keep shape
  const [activeTab, setActiveTab] = useState("students");

  // separate search per tab
  const [studentSearch, setStudentSearch] = useState("");
  const [invSearch, setInvSearch] = useState("");

  const [invPage, setInvPage] = useState(1);

  const invitations = useSelector((s) =>
    selectInvitations(s, "student", invSearch, invPage, invPageSize)
  );
  const invLoading = useSelector((s) =>
    selectInvitationsLoading(s, "student", invSearch, invPage, invPageSize)
  );
  const invPagination = useSelector((s) =>
    selectInvitationsPagination(s, "student", invSearch, invPage, invPageSize)
  );

  const fetchStudents = useCallback(() => {
    dispatch(
      fetchSchoolStudents({
        page: currentPage,
        limit: studentsPerPage,
        search: studentSearch || undefined,
        status: filters.status !== "all" ? filters.status : undefined,
      })
    );
  }, [dispatch, currentPage, studentSearch, filters.status]);

  const fetchInvitations = useCallback(() => {
    return dispatch(
      fetchSchoolInvitations({
        role: "student",
        search: invSearch,
        page: invPage,
        limit: invPageSize,
      })
    );
  }, [dispatch, invSearch, invPage]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // only fetch invitations when invitations tab active
  useEffect(() => {
    if (activeTab !== "invitations") return;
    fetchInvitations();
  }, [activeTab, fetchInvitations]);

  // reset relevant pages when searches change on their tab
  useEffect(() => {
    if (activeTab !== "students") return;
    setCurrentPage(1);
  }, [studentSearch, activeTab]);

  useEffect(() => {
    if (activeTab !== "invitations") return;
    setInvPage(1);
  }, [invSearch, activeTab]);

  // UX-only: when switching tabs, clear selection to avoid weird right-pane on small screens
  useEffect(() => {
    if (activeTab !== "students") setSelectedStudent(null);
  }, [activeTab]);

  const students = useMemo(() => {
    return (rawStudents || []).map((student) => ({
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
      isSchoolStudent: true,
      location: student.profile?.location || "",
    }));
  }, [rawStudents]);

  const filteredStudents = useMemo(() => {
    if (activeFilter === "all") return students;
    return students.filter((s) => s.isSchoolStudent);
  }, [students, activeFilter]);

  const handleSearch = useCallback(
    (term) => {
      if (activeTab === "students") {
        setStudentSearch(term);
        setCurrentPage(1);
      } else {
        setInvSearch(term);
        setInvPage(1);
      }
    },
    [activeTab]
  );

  const handleFilterChange = useCallback((filter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  }, []);

  const handleStudentselect = useCallback((student) => {
    setSelectedStudent(student);
  }, []);

  const handleStatusChange = useCallback(
    (studentId, action) => {
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

      if (
        selectedStudent?.id === studentId ||
        selectedStudent?._id === studentId
      ) {
        setSelectedStudent((prev) =>
          prev ? { ...prev, status: newStatus } : prev
        );
      }

      successToast("Student status updated successfully!");
    },
    [selectedStudent]
  );

  const handleInviteModalOpen = useCallback(() => {
    setShowInviteModal((v) => !v);
  }, []);

  const handleSuccessModal = useCallback(() => {
    setShowSuccessModal((v) => !v);
    if (activeTab === "students") fetchStudents();
    else fetchInvitations();
  }, [activeTab, fetchStudents, fetchInvitations]);

  const handleProfileRequestModal = useCallback(() => {
    setShowProfileRequestModal((v) => !v);
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const onCancelInvite = useCallback(
    async (inv) => {
      try {
        await dispatch(
          cancelSchoolInvitation({
            invitationId: inv._id,
            role: "student",
            search: invSearch || "",
            page: invPage,
            limit: invPageSize,
          })
        ).unwrap();

        if (activeTab === "invitations") await fetchInvitations();
        successToast("Invitation cancelled");
      } catch (e) {
        errorToast(e || "Failed to cancel invitation");
      }
    },
    [dispatch, invSearch, invPage, fetchInvitations, activeTab]
  );

  const invitationTotalCount = invPagination?.total ?? invitations?.length ?? 0;

  return (
    <div className="min-h-screen bg-background">
      <RoleBasedHeader />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pb-8">
        <PageHeader
          title="Manage Students"
          description="Manage your students and handle student invitations"
          isButton
          iconName="UserPlus"
          buttonTitle="Invite Student"
          onButtonClick={handleInviteModalOpen}
          studentCount={pagination?.total || 0}
        />

        {/* Responsive: stack on small screens, keep desktop layout identical */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-10">
          <div className="w-full lg:w-[59%]">
            <SearchBar onSearch={handleSearch} />
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
            <Button
              variant={activeFilter === "all" ? "default" : "outline"}
              onClick={() => handleFilterChange("all")}
              className="px-6 w-full sm:w-auto"
            >
              All
            </Button>
            <Button
              variant={activeFilter === "school" ? "default" : "outline"}
              onClick={() => handleFilterChange("school")}
              className="px-6 w-full sm:w-auto"
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
          <>
            <div className="bg-card border border-border rounded-lg p-4 mb-6 flex gap-3 overflow-x-auto">
              {[
                { id: "students", label: "Students", count: pagination?.total },
                {
                  id: "invitations",
                  label: "Invitations",
                  count: invitationTotalCount,
                },
              ].map((t) => (
                <button
                  key={t.id}
                  className={`px-4 py-2 rounded ${
                    activeTab === t.id ? "bg-primary text-white" : "bg-muted"
                  }`}
                  onClick={() => setActiveTab(t.id)}
                >
                  {t.label} ({t.count})
                </button>
              ))}
            </div>

            {activeTab === "students" && (
              <section className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-6">
                <Studentsection
                  studentData={filteredStudents}
                  selectedStudent={selectedStudent}
                  onSelect={handleStudentselect}
                  onStatusChange={handleStatusChange}
                  currentPage={pagination?.page || currentPage}
                  totalPages={pagination?.pages || 1}
                  totalItems={pagination?.total || 0}
                  onPageChange={handlePageChange}
                  pageSize={studentsPerPage}
                  onInviteStudent={handleInviteModalOpen}
                  onProfileRequest={handleProfileRequestModal}
                />

                {/* Responsive: keep desktop height, allow natural height on small */}
                <div className="bg-card border border-border rounded-lg h-auto xl:h-[600px]">
                  <StudentProfile
                    student={selectedStudent}
                    onClose={() => setSelectedStudent(null)}
                  />
                </div>
              </section>
            )}

            {activeTab === "invitations" && (
              <section className="grid grid-cols-1">
                <InvitationTable
                  title="Student invitations"
                  invitations={invitations}
                  pagination={invPagination}
                  loading={invLoading}
                  onCancel={onCancelInvite}
                  showRole={false}
                  onPageChange={setInvPage}
                />
              </section>
            )}
          </>
        )}
      </main>

      <InviteStudentModal
        isOpen={showInviteModal}
        onClose={handleInviteModalOpen}
        onSuccess={() => {
          setShowSuccessModal(true);
          if (activeTab === "students") fetchStudents();
          else fetchInvitations();
        }}
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
