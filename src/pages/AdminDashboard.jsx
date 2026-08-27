import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import logo from "../assets/hei-streak-logo.png";
import dlogo from "../assets/d-logo.png";
import "./AdminDashboard.css";
import { ProfileCard } from "../components/ProfileCard.jsx";
import { StudentForm } from "./StudentForm.jsx";

const SECTIONS = {
	PROFILE: "profile",
	STUDENTS: "students",
	COURSES: "courses",
	EXAMS: "exams",
};

export function AdminDashboard() {
	const [section, setSection] = useState(SECTIONS.PROFILE);
	const [students, setStudents] = useState([]); // sera rempli via l'API plus tard
	const [selectedStudent, setSelectedStudent] = useState(null);
	const [isCreating, setIsCreating] = useState(false);

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
						className={section === SECTIONS.STUDENTS ? "active" : ""}
						onClick={() => {
							setSection(SECTIONS.STUDENTS);
							setIsCreating(false);
						}}
					>
						Student Manager
					</button>
					<button
						className={section === SECTIONS.COURSES ? "active" : ""}
						onClick={() => setSection(SECTIONS.COURSES)}
					>
						Courses
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
							firstName: "Admin",
							lastName: "HEI",
							email: "admin@heistreak.com",
							role: "admin",
						}}
						emptyEmblemsText="This admin doesn't have any emblems"
					/>
				)}

				{section === SECTIONS.STUDENTS && !isCreating && (
					<>
						{selectedStudent ? (
							<ProfileCard
								person={selectedStudent}
								emptyEmblemsText="This student doesn't have any emblems"
							/>
						) : (
							<div className="empty-state">
								<img src={logo} alt="" className="empty-state-logo" />
								<p>No accounts created yet</p>
							</div>
						)}
					</>
				)}

				{section === SECTIONS.STUDENTS && isCreating && (
					<StudentForm
						onCancel={() => setIsCreating(false)}
						onCreate={(newStudent) => {
							const studentWithId = { ...newStudent, id: Date.now() };
							setStudents([...students, studentWithId]);
							setSelectedStudent(studentWithId);
							setIsCreating(false);
						}}
					/>
				)}

				{section === SECTIONS.COURSES && <div>Courses view (a construire)</div>}

				{section === SECTIONS.EXAMS && <div>Exams view (a construire)</div>}
			</main>

			{/* ===== Barre d'actions droite ===== */}
			<aside className="dashboard-actions">
				{section === SECTIONS.STUDENTS && (
					<>
						<button
							className="action-create"
							onClick={() => setIsCreating(true)}
						>
							Create
						</button>
						<div className="action-list">
							{students.length === 0 && (
								<p className="action-list-empty">No students yet</p>
							)}
							{students.map((s) => (
								<button
									key={s.id}
									className="action-list-item"
									onClick={() => {
										setSelectedStudent(s);
										setIsCreating(false);
									}}
								>
									{s.firstName} {s.lastName}
								</button>
							))}
						</div>
					</>
				)}

				{section === SECTIONS.COURSES && <div>Courses actions (a construire)</div>}

				{section === SECTIONS.EXAMS && <div>Exams actions (a construire)</div>}
			</aside>
		</div>
	);
}