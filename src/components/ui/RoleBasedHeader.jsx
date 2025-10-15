import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Icon from "../AppIcon";
import Button from "./Button";
import logo from "../../assets/logo.svg";
import { selectAuthUser } from "reducers/auth/authSelectors";
import { logout } from "reducers/auth/authSlice";
import Image from "components/AppImage";
import ManageCourseIcon from "components/icons/ManageCourseIcon";
import NotificationModal from "./NotificationModal";
import { getNotificationByRole } from "./data";

const RoleBasedHeader = () => {
  const authUser = useSelector(selectAuthUser);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState("student");
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [hoveredPath, setHoveredPath] = useState(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const profileMenuRef = useRef(null);
  const notificationRef = useRef(null);

  const teacherType =
    (authUser?.role === "teacher" && authUser?.profile?.employmentType) ||
    "independent";

  useEffect(() => {
    if (authUser) {
      setUserRole(authUser?.role);
    } else {
      setUserRole("guest");
    }
  }, [location.pathname]);

  useEffect(() => {
    const notifications = getNotificationByRole(userRole);
    setNotifications(notifications);
  }, [userRole]);

  const getNavigationItems = () => {
    const baseItems = {
      student: [
        {
          label: "Dashboard",
          path: "/student-parent/dashboard",
          icon: "House",
          children: [
            "/student-parent/lesson-calendar",
            "/student-parent/progress-analytics",
            "/student-parent/profile-settings",
            "/student-parent/payment-billing",
          ],
        },
        { label: "Find Teacher", path: "/teachers", icon: "Search" },
        // { label: "Schedule", path: "/booking-system", icon: "Calendar" },
        { label: "Lessons", path: "/student-parent/lessons", icon: "Book" },
        // { label: "Progress",  path: "/student-parent/progress", icon: "TrendingUp" },
        { label: "Practice", path: "/student-parent/games", icon: "Gamepad2" },
        {
          label: "Messages",
          path: "/student-parent/messages",
          icon: "MessageCircle",
        },
      ],
      parent: [
        {
          label: "Dashboard",
          path: "/student-parent/dashboard",
          icon: "Home",
          children: [
            "/student-parent/profile-settings",
            "/student-parent/payment-billing",
          ],
        },
        { label: "Find Teacher", path: "/teachers", icon: "Search" },
        // { label: "Schedule", path: "/booking-system", icon: "Calendar" },
        { label: "Lessons", path: "/student-parent/lessons", icon: "Book" },
        // { label: "Progress",  path: "/student-parent/progress", icon: "TrendingUp" },
        { label: "Practice", path: "/student-parent/games", icon: "Gamepad2" },
        {
          label: "Messages",
          path: "/student-parent/messages",
          icon: "MessageCircle",
        },
      ],
      teacherBase: [
        {
          label: "Dashboard",
          path: "/teacher/dashboard",
          icon: "Home",
          children: [
            "/teacher/students-feedback",
            "/teacher/scheduled-lessons",
            "/teacher/profile-settings",
          ],
        },
        {
          label: "Manage Lessons",
          path: "/teacher/manage-lessons",
          icon: "Users",
        },
        {
          label: "Manage Schedule",
          path: "/teacher/manage-schedule",
          icon: "Calendar",
        },
        {
          label: "Messages",
          path: "/teacher/messages",
          icon: "MessageCircle",
        },
      ],
      admin: [
        {
          label: "Overview",
          path: "/school/dashboard",
          icon: "BarChart3",
        },
        {
          label: "Teachers",
          path: "/school/teachers",
          icon: "Users",
        },
        {
          label: "Students",
          path: "/school/students",
          icon: "GraduationCap",
        },
        {
          label: "Reports",
          path: "/school/reports",
          icon: "FileText",
        },
      ],
      guest: [{ label: "Login", path: "/login", icon: "LogIn" }],
    };

    // Independent teacher extra tabs
    const independentTeacherTabs = [
      {
        label: "Manage Courses",
        path: "/teacher/manage-courses",
        iconComponent: ManageCourseIcon,
        children: [
          "/teacher/create-course",
          "/teacher/lessons",
          "/teacher/edit-course",
          "/teacher/edit-lesson",
          "/teacher/create-lesson",
        ],
      },
      {
        label: "Earnings",
        path: "/teacher/earnings",
        icon: "DollarSign",
      },
    ];

    // School teacher extra tabs
    const schoolTeacherTabs = [
      { label: "Progress", path: "/teacher/progress", icon: "TrendingUp" },
    ];

    if (userRole === "teacher") {
      if (teacherType === "independent") {
        return [...baseItems.teacherBase, ...independentTeacherTabs];
      } else {
        return [...baseItems.teacherBase, ...schoolTeacherTabs];
      }
    }

    return baseItems[userRole] || baseItems.guest;
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    setIsMenuOpen(false);
  };

  const handleNotificationClick = (notificationId) => {
    // Mark as read logic would go here
    console.log("Notification clicked:", notificationId);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setShowProfile(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navigationItems = getNavigationItems();
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="fixed top-0 left-0 right-0 bg-card border-b border-border z-50">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Logo Section */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            {/* <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="GraduationCap" size={20} color="white" />
            </div> */}
            <div className="flex flex-col">
              {/* <span className="text-lg font-semibold text-foreground">HelloK12</span> */}
              <Image
                src={logo}
                alt="Company Logo"
                className="h-10 object-contain cursor-pointer"
                onClick={() => navigate("/")}
              />
              {userRole !== "guest" && (
                <span className="text-xs text-muted-foreground">
                  {authUser.schoolName}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navigationItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              item.children?.some((child) =>
                location.pathname.startsWith(child)
              );

            return item?.icon ? (
              <Button
                key={item.path}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={() => handleNavigation(item.path)}
                className="transition-micro"
                children={item.label}
                iconName={item.icon}
                iconPosition="left"
                iconSize={16}
              />
            ) : (
              <button
                key={item.path}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 px-3 gap-2 ${
                  isActive
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "hover:bg-accent hover:text-accent-foreground"
                }`}
                onClick={() => handleNavigation(item.path)}
                onMouseEnter={() => setHoveredPath(item.path)}
                onMouseLeave={() => setHoveredPath(null)}
              >
                <item.iconComponent
                  selected={isActive || hoveredPath === item.path}
                />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {userRole !== "guest" && (
            <>
              {/* Notifications */}
              <div ref={notificationRef} className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className="relative"
                >
                  <Icon name="Bell" size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-error text-error-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                      {unreadCount}
                    </span>
                  )}
                </Button>

                {isNotificationOpen && (
                  <NotificationModal
                    notifications={notifications}
                    handleNotificationClick={handleNotificationClick}
                  />
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setShowProfile(!showProfile)}
                  className="flex items-center space-x-2 p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-smooth"
                >
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon name="User" size={16} color="var(--color-primary)" />
                  </div>
                  <span className="hidden md:block text-sm font-medium text-foreground">
                    {authUser.name}
                  </span>
                  <Icon name="ChevronDown" size={14} />
                </button>

                {/* Profile Dropdown Menu */}
                {showProfile && (
                  <div className="absolute right-0 mt-2 w-56 bg-popover border border-border rounded-lg shadow-elevated z-50">
                    <div className="px-4 py-3 border-b border-border">
                      <p className="text-sm font-medium text-foreground">
                        {authUser.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {authUser.email}
                      </p>
                    </div>
                    <div className="py-1">
                      <button
                        className="flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-muted transition-smooth"
                        onClick={() =>
                          navigate(
                            `/${
                              ["student", "parent"].includes(authUser.role)
                                ? "student-parent"
                                : authUser.role
                            }/profile-settings`
                          )
                        }
                      >
                        <Icon name="User" size={16} className="mr-3" />
                        Profile Settings
                      </button>
                      {["student", "parent"].includes(authUser.role) && (
                        <button
                          className="flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-muted transition-smooth"
                          onClick={() =>
                            navigate(
                              `/${
                                ["student", "parent"].includes(authUser.role)
                                  ? "student-parent"
                                  : authUser.role
                              }/payment-billing`
                            )
                          }
                        >
                          <Icon name="CreditCard" size={16} className="mr-3" />
                          Payment & Billing
                        </button>
                      )}
                      {/* <button className="flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-muted transition-smooth">
                        <Icon name="HelpCircle" size={16} className="mr-3" />
                        Help & Support
                      </button> */}
                      <div className="border-t border-border mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-error hover:bg-error/10 transition-smooth"
                        >
                          <Icon name="LogOut" size={16} className="mr-3" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Mobile Menu Button */}
          {/* <Button
            variant="ghost"
            size="icon"
            iconName={isMenuOpen ? "X" : "Menu"}
            iconSize={20}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden"
          /> */}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-card border-t border-border shadow-modal">
          <div className="px-4 py-3 space-y-1">
            {navigationItems.map((item) => (
              <Button
                key={item.path}
                variant={location.pathname === item.path ? "default" : "ghost"}
                size="sm"
                iconName={item.icon}
                iconPosition="left"
                iconSize={16}
                onClick={() => handleNavigation(item.path)}
                className="w-full justify-start"
              >
                {item.label}
              </Button>
            ))}

            {userRole !== "guest" && (
              <>
                <div className="border-t border-border my-2"></div>
                <div className="flex items-center space-x-3 px-3 py-2">
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                    <Icon
                      name="User"
                      size={20}
                      color="var(--color-muted-foreground)"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-foreground">
                      {authUser.name}
                    </div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {userRole}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="LogOut"
                  iconPosition="left"
                  iconSize={16}
                  onClick={handleLogout}
                  className="w-full justify-start text-destructive hover:text-destructive"
                >
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default RoleBasedHeader;
