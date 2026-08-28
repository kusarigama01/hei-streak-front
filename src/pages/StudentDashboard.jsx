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
			questionCount: 1,
			totalPoints: 1,
			questions: [
				{
					id: 101,
					statement: "Que signifie HTML ?",
					points: 1,
					choices: [
						{ id: 1, letter: "A", text: "HyperText Markup Language" },
						{ id: 2, letter: "B", text: "HighText Machine Language" },
						{ id: 3, letter: "C", text: "HyperTransfer Markup Language" },
						{ id: 4, letter: "D", text: "Home Tool Markup Language" },
						{ id: 5, letter: "E", text: "Hyperlink Text Markup Language" },
						{ id: 6, letter: "F", text: "Hyper Modern Language" },
					],
					correctChoiceId: 1, // lettre A, jamais envoye au student en vrai (RG-07), ici seulement pour la simulation front
				},
			],
		},
		{
			id: 2,
			title: "Contrôle POO",
			courseCode: "PROG2",
			endsAt: "2026-09-10T18:00:00",
			questionCount: 1,
			totalPoints: 1,
			questions: [
				{
					id: 201,
					statement: "Quel principe de la POO permet de cacher les détails internes d'une classe ?",
					points: 1,
					choices: [
						{ id: 1, letter: "A", text: "Héritage" },
						{ id: 2, letter: "B", text: "Polymorphisme" },
						{ id: 3, letter: "C", text: "Encapsulation" },
						{ id: 4, letter: "D", text: "Abstraction" },
						{ id: 5, letter: "E", text: "Composition" },
						{ id: 6, letter: "F", text: "Instanciation" },
					],
					correctChoiceId: 3, // lettre C
				},
			],
		},
	]);

	const [activeExam, setActiveExam] = useState(null); // exam en cours de passage
	const [answers, setAnswers] = useState({}); // { questionId: choiceId }
	const [showConfirm, setShowConfirm] = useState(false);

	const [examSearch, setExamSearch] = useState("");

	const [examResult, setExamResult] = useState(null);

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
						emptyEmblemsText="No emblems"
					/>
				)}

				{section === SECTIONS.CODE && (
					<div className="empty-state">
						<img src={logo} alt="" className="empty-state-logo" />
						<p>Coming soon...</p>
					</div>
				)}

				{section === SECTIONS.EXAMS && !activeExam && !examResult && (
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
										<button
											className="student-exam-start-btn"
											onClick={() => {
												setActiveExam(ex);
												setAnswers({});
												setShowConfirm(false);
											}}
										>
											Take exam
										</button>
									</div>
								))}
							</div>
						)}
					</>
				)}

				{section === SECTIONS.EXAMS && activeExam && (
					<div className="exam-taking">
						<h2>{activeExam.title}</h2>
						<p className="exam-taking-meta">
							{activeExam.courseCode} • {activeExam.questionCount} question(s) • {activeExam.totalPoints} point(s)
						</p>

						{activeExam.questions.map((q, qIndex) => (
							<div key={q.id} className="exam-question-block">
								<p className="exam-question-statement">
									{qIndex + 1}. {q.statement}
								</p>
								<div className="exam-choices">
									{q.choices.map((c) => (
										<label key={c.id} className="exam-choice-label">
											<input
												type="radio"
												name={`question-${q.id}`}
												checked={answers[q.id] === c.id}
												onChange={() =>
													setAnswers({ ...answers, [q.id]: c.id })
												}
											/>
											<span className="choice-letter">{c.letter}</span>
											{c.text}
										</label>
									))}
								</div>
							</div>
						))}

						<div className="exam-taking-actions">
							<button
								className="btn-cancel"
								onClick={() => setActiveExam(null)}
							>
								Cancel
							</button>
							<button
								className="btn-create"
								onClick={() => setShowConfirm(true)}
							>
								Submit
							</button>
						</div>

						{showConfirm && (
							<div className="confirm-overlay">
								<div className="confirm-box">
									<p>Are you sure you want to submit your answers? This cannot be undone.</p>
									<div className="confirm-actions">
										<button className="btn-cancel" onClick={() => setShowConfirm(false)}>
											Go back
										</button>
										<button
											className="btn-create"
											onClick={() => {
												const correction = activeExam.questions.map((q) => {
													const studentChoiceId = answers[q.id] ?? null;
													const isCorrect = studentChoiceId === q.correctChoiceId;
													return {
														questionId: q.id,
														statement: q.statement,
														points: q.points,
														choices: q.choices,
														studentChoiceId,
														correctChoiceId: q.correctChoiceId,
														isCorrect,
													};
												});
												const score = correction.reduce(
													(sum, c) => sum + (c.isCorrect ? c.points : 0),
													0
												);
												setExamResult({
													examTitle: activeExam.title,
													courseCode: activeExam.courseCode,
													score,
													totalPoints: activeExam.totalPoints,
													correction,
												});
												setShowConfirm(false);
												setActiveExam(null);
											}}
										>
											Confirm submission
										</button>
									</div>
								</div>
							</div>
						)}
					</div>
				)}

				{section === SECTIONS.EXAMS && examResult && (
					<div className="exam-result">
						<div className="exam-result-score">
							<span className="score-value">
								{examResult.score} / {examResult.totalPoints}
							</span>
							<span className="score-label">{examResult.examTitle}</span>
						</div>

						<div className="exam-correction">
							{examResult.correction.map((c, i) => (
								<div
									key={c.questionId}
									className={`correction-block ${c.isCorrect ? "correct" : "incorrect"}`}
								>
									<p className="correction-statement">
										{i + 1}. {c.statement}
									</p>
									<div className="correction-choices">
										{c.choices.map((choice) => {
											const isStudentChoice = choice.id === c.studentChoiceId;
											const isCorrectChoice = choice.id === c.correctChoiceId;
											let choiceClass = "";
											if (isCorrectChoice) choiceClass = "choice-correct";
											else if (isStudentChoice && !isCorrectChoice) choiceClass = "choice-wrong";
											return (
												<div key={choice.id} className={`correction-choice ${choiceClass}`}>
													<span className="choice-letter">{choice.letter}</span>
													{choice.text}
													{isStudentChoice && <span className="your-answer-tag">Your answer</span>}
												</div>
											);
										})}
									</div>
								</div>
							))}
						</div>

						<button className="btn-create" onClick={() => setExamResult(null)}>
							Back to exams
						</button>
					</div>
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