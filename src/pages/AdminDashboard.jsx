import { useState, useEffect } from "react";

import { api } from "../api/client.js";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import logo from "../assets/hei-streak-logo.png";
import dlogo from "../assets/d-logo.png";
import "./AdminDashboard.css";
import { ProfileCard } from "../components/ProfileCard.jsx";
import { StudentForm } from "./StudentForm.jsx";

import { CourseForm } from "./CourseForm.jsx";
import { COURSE_META } from "./courseMeta.js";

import { ExamForm } from "./ExamForm.jsx";


const SECTIONS = {
	PROFILE: "profile",
	STUDENTS: "students",
	COURSES: "courses",
	EXAMS: "exams",
};

const toApiName = (student) =>
	[student.firstName, student.lastName].filter(Boolean).join(" ");

const fromApiName = (apiStudent) => {
	const parts = apiStudent.name.split(" ");
	return {
		...apiStudent,
		lastName: parts[parts.length - 1],
		firstName: parts.slice(0, -1).join(" "),
	};
};

export function AdminDashboard() {
		const [section, setSection] = useState(SECTIONS.PROFILE);
		const [students, setStudents] = useState([]);

		useEffect(() => {
			api.get("/students")
				.then((data) => setStudents(data.map(fromApiName)))
				.catch((err) => console.error("Failed to load students:", err));
		}, []);

		const [selectedStudent, setSelectedStudent] = useState(null);
		const [isCreating, setIsCreating] = useState(false);

		const { logout } = useAuth();
		const navigate = useNavigate();
		const [isEditing, setIsEditing] = useState(false);

		const [courses, setCourses] = useState([]);
		const [courseSearch, setCourseSearch] = useState("");

		const [isCreatingCourse, setIsCreatingCourse] = useState(false);

		const [viewedCourse, setViewedCourse] = useState(null);

		const [exams, setExams] = useState([
  {
    id: 1,
    title: "Quiz HTML de base",
    courseCode: "WEB2",
    type: "qcm",
    startsAt: "2026-08-01T00:00:00",
    endsAt: "2026-12-31T23:59:00",
    createdAt: "2026-08-25T10:00:00",
    attemptCount: 2,
    totalPoints: 5,
    questions: [
      {
        id: 1,
        statement: "What does HTML stand for?",
        points: 5,
        choices: [
          { id: 1, text: "HyperText Markup Language", isCorrect: true },
          { id: 2, text: "HighText Machine Language", isCorrect: false },
        ],
      },
    ],
    results: [
      { studentId: 1, name: "Jean Rakoto", score: 5, submittedAt: "2026-08-28T10:00:00" },
      { studentId: 2, name: "Marie Rasoa", score: 3, submittedAt: "2026-08-28T11:30:00" },
    ],
  },
]);
		const [isCreatingExam, setIsCreatingExam] = useState(false);
		const [openExamMenu, setOpenExamMenu] = useState(null); // id de l'exam dont le menu "..." est ouvert

const [viewingQuestionsFor, setViewingQuestionsFor] = useState(null);
const [viewingResultsFor, setViewingResultsFor] = useState(null);

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

		const handleEditExam = (exam) => {
			setOpenExamMenu(null);
			// sera branche a l'etape 2, une fois le formulaire pret
		};

		const handleDeleteExam = (exam) => {
			setExams(exams.filter((ex) => ex.id !== exam.id));
			setOpenExamMenu(null);
		};

		const getExamStatus = (exam) => {
			const now = new Date();
			const start = new Date(exam.startsAt);
			const end = new Date(exam.endsAt);
			if (now < start) return "unavailable";
			if (now > end) return "over";
			return "available";
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

					{section === SECTIONS.STUDENTS && !isCreating && !isEditing && (
						<>
							{selectedStudent ? (
								<ProfileCard
									person={selectedStudent}
									emptyEmblemsText="This student doesn't have any emblems"
								/>
							) : (
								<div className="empty-state">
									<img src={logo} alt="" className="empty-state-logo" />
									<p>Select or create a student</p>
								</div>
							)}
						</>
					)}

					{section === SECTIONS.STUDENTS && isEditing && selectedStudent && (
						<StudentForm
							initialData={selectedStudent}
							onCancel={() => setIsEditing(false)}
							onCreate={(updatedData) => {
								const updated = students.map((s) =>
									s.id === selectedStudent.id ? { ...updatedData, id: s.id } : s
								);
								setStudents(updated);
								setSelectedStudent({ ...updatedData, id: selectedStudent.id });
								setIsEditing(false);
							}}
						/>
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

					{section === SECTIONS.COURSES && !isCreatingCourse && !viewedCourse && (
						<>
							{courses.length === 0 ? (
								<div className="empty-state">
									<img src={logo} alt="" className="empty-state-logo" />
									<p>No courses created yet</p>
								</div>
							) : (
								<div className="course-grid">
									{courses.map((c) => (
										<div key={c.id} className="course-tile" style={{ borderColor: c.color }}>
											<i className={`fa-solid ${c.icon}`} style={{ color: c.color }}></i>
											<span className="course-code" style={{ backgroundColor: c.color }}>
												{c.code}
											</span>
											<h3>{c.name}</h3>
											<span className="course-date">{c.createdAt}</span>
											<button
												className="course-view-btn"
												onClick={() => setViewedCourse(c)}
											>
												View course
											</button>
										</div>
									))}
								</div>
							)}
						</>
					)}

					{section === SECTIONS.COURSES && isCreatingCourse && (
						<CourseForm
							onCancel={() => setIsCreatingCourse(false)}
							onCreate={(newCourseData) => {
								const meta = COURSE_META[newCourseData.code];
								const newCourse = {
									...newCourseData,
									id: Date.now(),
									color: meta.color,
									icon: meta.icon,
									createdAt: new Date().toLocaleString("en-GB", {
										day: "2-digit",
										month: "2-digit",
										year: "numeric",
										hour: "2-digit",
										minute: "2-digit",
									}),
								};
								setCourses([...courses, newCourse]);
								setIsCreatingCourse(false);
							}}
						/>
					)}

					{section === SECTIONS.COURSES && viewedCourse && !isCreatingCourse && (
						<div className="course-detail" style={{ borderColor: viewedCourse.color }}>
							<button className="course-back-btn" onClick={() => setViewedCourse(null)}>
								← Back to courses
							</button>
							<i className={`fa-solid ${viewedCourse.icon}`} style={{ color: viewedCourse.color }}></i>
							<span className="course-code" style={{ backgroundColor: viewedCourse.color }}>
								{viewedCourse.code}
							</span>
							<h2>{viewedCourse.name}</h2>
							<span className="course-date">{viewedCourse.createdAt}</span>
							<p className="course-full-description">{viewedCourse.description}</p>
						</div>
					)}

					{section === SECTIONS.EXAMS && !isCreatingExam && (
						<>
							{exams.length === 0 ? (
								<div className="empty-state">
									<img src={logo} alt="" className="empty-state-logo" />
									<p>No exams created yet</p>
								</div>
							) : (
								<div className="exam-list">
									{exams.map((ex) => {
										const status = getExamStatus(ex);
										const meta = COURSE_META[ex.courseCode];
										return (
											<div key={ex.id} className={`exam-block status-${status}`}>
												<div className="exam-block-top">
													<span className="exam-block-code">
														{status === "unavailable"
															? "EXAM UNAVAILABLE"
															: `${ex.courseCode} - ${ex.type === "qcm" ? "QCM" : ex.type}`}
													</span>
													<span className="exam-block-status">Status: {status}</span>
												</div>
												<h3 className="exam-block-title">{ex.title}</h3>
												<div className="exam-block-bottom">
													<span className="exam-block-created">
														Created {new Date(ex.createdAt).toLocaleString("en-GB")}
													</span>
													<span className="exam-block-window">
														Available from {new Date(ex.startsAt).toLocaleString("en-GB")} to{" "}
														{new Date(ex.endsAt).toLocaleString("en-GB")}
													</span>
												</div>
											</div>
										);
									})}
								</div>
							)}
						</>
					)}

					{section === SECTIONS.EXAMS && isCreatingExam && (
						<ExamForm
							onCancel={() => setIsCreatingExam(false)}
							onCreate={(newExamData) => {
								const newExam = {
									...newExamData,
									id: Date.now(),
									createdAt: new Date().toISOString(),
								};
								setExams([...exams, newExam]);
								setIsCreatingExam(false);
							}}
						/>
					)}

					{section === SECTIONS.EXAMS && viewingQuestionsFor && (
  <div className="questions-editor">
    <button className="course-back-btn" onClick={() => setViewingQuestionsFor(null)}>
      ← Close
    </button>

    <h2>{viewingQuestionsFor.title} — Questions</h2>

    {(viewingQuestionsFor.attemptCount ?? 0) > 0 && (
      <div className="locked-banner">
        🔒 This exam has attempts. Questions are locked and cannot be modified (RG-08).
      </div>
    )}

    {(viewingQuestionsFor.questions ?? []).length === 0 ? (
      <p className="action-list-empty">No questions added yet for this exam.</p>
    ) : (
      <div className="questions-readonly-list">
        {viewingQuestionsFor.questions.map((q, i) => (
          <div key={q.id} className="question-readonly-block">
            <p className="correction-statement">
              {i + 1}. {q.statement} ({q.points} pt{q.points > 1 ? "s" : ""})
            </p>
            <div className="correction-choices">
              {q.choices.map((c) => (
                <div
                  key={c.id}
                  className={`correction-choice ${c.isCorrect ? "choice-correct" : ""}`}
                >
                  {c.text}
                  {c.isCorrect && <span className="your-answer-tag">Correct</span>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)}

{section === SECTIONS.EXAMS && viewingResultsFor && (
  <div className="exam-results-view">
    <button className="course-back-btn" onClick={() => setViewingResultsFor(null)}>
      ← Back to exams
    </button>

    <h2>{viewingResultsFor.title} — Results</h2>

    {(viewingResultsFor.results ?? []).length === 0 ? (
      <p className="action-list-empty">No attempts yet for this exam.</p>
    ) : (
      <>
        <div className="results-summary">
          <div className="results-stat">
            <span className="results-stat-value">
              {(
                viewingResultsFor.results.reduce((sum, r) => sum + r.score, 0) /
                viewingResultsFor.results.length
              ).toFixed(2)}
            </span>
            <span className="results-stat-label">Average</span>
          </div>
          <div className="results-stat">
            <span className="results-stat-value">
              {viewingResultsFor.results.length}
            </span>
            <span className="results-stat-label">Attempts</span>
          </div>
        </div>

        <table className="results-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Score</th>
              <th>Submitted at</th>
            </tr>
          </thead>
          <tbody>
            {viewingResultsFor.results.map((r) => (
              <tr key={r.studentId}>
                <td>{r.name}</td>
                <td>{r.score} / {viewingResultsFor.totalPoints}</td>
                <td>{new Date(r.submittedAt).toLocaleString("en-GB")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    )}
  </div>
)}
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
									<button className="action-warning" onClick={() => handleResetPassword(selectedStudent)}>Reset password</button>
									<button className="action-danger" onClick={() => handleDeactivate(selectedStudent)}>
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
										{s.firstName} {s.lastName} {" "}
										{s.isActive === false && <span className="inactive-badge">(Inactive)</span>}
									</button>
								))}
							</div>
						</>
					)}

					{section === SECTIONS.COURSES && (
						<>
							<button
								className="action-create"
								onClick={() => setIsCreatingCourse(true)}>
								Add course
							</button>

							<input
								type="text"
								className="action-search"
								placeholder="Search courses..."
								value={courseSearch}
								onChange={(e) => setCourseSearch(e.target.value)}
							/>

							<select className="action-filter">
								<option value="">Filter...</option>
								<option value="PROG2">PROG2</option>
								<option value="WEB2">WEB2</option>
								<option value="SYS2">SYS2</option>
								<option value="LV1">LV1</option>
							</select>

							<div className="action-list">
								{courses.length === 0 && (
									<p className="action-list-empty">No courses yet</p>
								)}
								{courses.map((c) => (
									<div key={c.id} className="action-list-item">
										{c.code} — {c.name}
									</div>
								))}
							</div>
						</>
					)}

					{section === SECTIONS.EXAMS && (
						<>
							<button
								className="action-create"
								onClick={() => setIsCreatingExam(true)}
							>
								Add exam
							</button>

							<div className="action-list">
								{exams.length === 0 && (
									<p className="action-list-empty">No exams yet</p>
								)}
								{exams.map((ex) => (
									<div key={ex.id} className="action-list-item exam-action-item">
										<span>{ex.title}</span>
										<button
											className="exam-menu-trigger"
											onClick={() =>
												setOpenExamMenu(openExamMenu === ex.id ? null : ex.id)
											}
										>
											•••
										</button>
										{openExamMenu === ex.id && (
  <div className="exam-menu-dropdown">
    <button onClick={() => { setViewingQuestionsFor(ex); setOpenExamMenu(null); }}>
      Questions
    </button>
    <button onClick={() => { setViewingResultsFor(ex); setOpenExamMenu(null); }}>
      Results
    </button>
    <button onClick={() => handleEditExam(ex)}>Edit</button>
    <button onClick={() => handleDeleteExam(ex)}>Delete</button>
  </div>
)}
									</div>
								))}
							</div>
						</>
					)}
				</aside>
			</div>
		);
	}