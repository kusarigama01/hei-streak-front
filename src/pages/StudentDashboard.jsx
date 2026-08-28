import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import logo from "../assets/hei-streak-logo.png";
import dlogo from "../assets/d-logo.png";
import "./StudentDashboard.css";
import { ProfileCard } from "../components/ProfileCard.jsx";

const SECTIONS = {
	PROFILE: "profile",
	CODE: "code",
	EXAMS: "exams",
};

export function StudentDashboard() {
	const [section, setSection] = useState(SECTIONS.PROFILE);
	const [exams, setExams] = useState([
		{
			id: 1,
			title: "Quiz HTML de base",
			courseCode: "WEB2",
			endsAt: "2026-09-05T23:59:00",
			questionCount: 5,
			totalPoints: 5,
		},
		{
			id: 2,
			title: "Contrôle POO",
			courseCode: "PROG2",
			endsAt: "2026-09-10T18:00:00",
			questionCount: 8,
			totalPoints: 10,
		},
	]);

	const [examSearch, setExamSearch] = useState("");

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
							<div className="student-exam-list">
								{exams.map((ex) => (
									<div key={ex.id} className="student-exam-card">
										<span className="student-exam-code">{ex.courseCode}</span>
										<h3>{ex.title}</h3>
										<p className="student-exam-meta">
											{ex.questionCount} questions • {ex.totalPoints} points
										</p>
										<p className="student-exam-deadline">
											Available until {new Date(ex.endsAt).toLocaleString("en-GB")}
										</p>
										<button className="student-exam-start-btn">
											Take exam
										</button>
									</div>
								))}
							</div>
						)}
					</>
				)}
			</main>

			{/* ===== Barre d'actions droite ===== */}
			<aside className="dashboard-actions">
				{section === SECTIONS.EXAMS && (
					<>
						<input
							type="text"
							className="action-search"
							placeholder="Search exams..."
							value={examSearch}
							onChange={(e) => setExamSearch(e.target.value)}
						/>

						<div className="action-list">
							{exams.length === 0 && (
								<p className="action-list-empty">No exams yet</p>
							)}
							{exams
								.filter((ex) =>
									ex.title.toLowerCase().includes(examSearch.toLowerCase())
								)
								.map((ex) => (
									<div key={ex.id} className="action-list-item">
										{ex.courseCode} — {ex.title}
									</div>
								))}
						</div>
					</>
				)}
			</aside>
		</div>
	);
}