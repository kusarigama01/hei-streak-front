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
	const [students, setStudents] = useState([]);
	const [selectedStudent, setSelectedStudent] = useState(null);
	const [isCreating, setIsCreating] = useState(false);
	
	const { logout } = useAuth();
	const navigate = useNavigate();
	const [isEditing, setIsEditing] = useState(false);

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	const handleResetPassword = (student) => {
		const newPassword = prompt(`New temporary password for ${student.lastName}:`);
		if (!newPassword) return;
		setStudents(
			students.map((s) =>
				s.id === student.id ? { ...s, password: newPassword } : s
			)
		);
		alert("Password reset (mock only, not sent to backend yet).");
	};

	const handleDeactivate = (student) => {
		const updated = students.map((s) =>
			s.id === student.id ? { ...s, isActive: s.isActive === false ? true : false } : s
		);
		setStudents(updated);
		setSelectedStudent(updated.find((s) => s.id === student.id));
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
							onClick={() => {
								setIsCreating(true);
								setSelectedStudent(null);
								setIsEditing(false);
							}}
						>
							Create
						</button>

						{selectedStudent && !isCreating && (
							<div className="action-student-controls">
								<button onClick={() => setIsEditing(true)}>Edit</button>
								<button onClick={() => handleResetPassword(selectedStudent)}>
									Reset password
								</button>
								<button
									className="action-danger"
									onClick={() => handleDeactivate(selectedStudent)}
								>
									{selectedStudent.isActive === false ? "Reactivate" : "Deactivate"}
								</button>
							</div>
						)}

						<div className="action-list">
							{students.length === 0 && (
								<p className="action-list-empty">No students yet</p>
							)}
							{students.map((s) => (
								<button
									key={s.id}
									className={`action-list-item ${s.isActive === false ? "inactive" : ""}`}
									onClick={() => {
										setSelectedStudent(s);
										setIsCreating(false);
										setIsEditing(false);
									}}
								>
									{s.firstName} {s.lastName}{" "}
									{s.isActive === false && <span className="inactive-badge">(Inactive)</span>}
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