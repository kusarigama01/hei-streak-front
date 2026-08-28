import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import logo from "../assets/hei-streak-logo.png";
import dlogo from "../assets/d-logo.png";
import { StudentDashboard } from "./pages/StudentDashboard.jsx";
import "./StudentDashboard.css";
import { ProfileCard } from "../components/ProfileCard.jsx";

const SECTIONS = {
  PROFILE: "profile",
  CODE: "code",
  EXAMS: "exams",
};

export function StudentDashboard() {
  const [section, setSection] = useState(SECTIONS.PROFILE);
  const [exams, setExams] = useState([]);

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dashboard-layout">
      {/* ===== Sidebar ===== */}
      <aside className="dashboard-sidebar">
        <button
          className="sidebar-logo"
          onClick={() => setSection(SECTIONS.PROFILE)}
        >
          <img src={dlogo} alt="HEI Streak" />
        </button>

        <nav className="sidebar-nav">
          <button
            className={section === SECTIONS.PROFILE ? "active" : ""}
            onClick={() => setSection(SECTIONS.PROFILE)}
          >
            Profile
          </button>
          <button
            className={section === SECTIONS.CODE ? "active" : ""}
            onClick={() => setSection(SECTIONS.CODE)}
          >
            Code
          </button>
          <button
            className={section === SECTIONS.EXAMS ? "active" : ""}
            onClick={() => setSection(SECTIONS.EXAMS)}
          >
            Exams
          </button>
        </nav>

        <button className="sidebar-logout" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      {/* ===== Viewport central ===== */}
      <main className="dashboard-viewport">
        {section === SECTIONS.PROFILE && (
          <ProfileCard
            person={{
              firstName: "",
              lastName: "Student",
              email: "student@heistreak.com",
              role: "student",
            }}
            emptyEmblemsText="This student doesn't have any emblems"
          />
        )}

        {section === SECTIONS.CODE && (
          <div className="empty-state">
            <img src={logo} alt="" className="empty-state-logo" />
            <p>Coming soon</p>
          </div>
        )}

        {section === SECTIONS.EXAMS && (
          <>
            {exams.length === 0 ? (
              <div className="empty-state">
                <img src={logo} alt="" className="empty-state-logo" />
                <p>No exams available yet</p>
              </div>
            ) : (
              <div>Exam list (a construire)</div>
            )}
          </>
        )}
      </main>

      {/* ===== Barre d'actions droite ===== */}
      <aside className="dashboard-actions">
        {section === SECTIONS.EXAMS && (
          <div className="action-list">
            <p className="action-list-empty">No exams yet</p>
          </div>
        )}
      </aside>
    </div>
  );
}