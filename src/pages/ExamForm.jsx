import { useState } from "react";
import { COURSE_META } from "./courseMeta.js";
import "./ExamForm.css";

const EMPTY_QUESTION = () => ({
	id: Date.now() + Math.random(),
	statement: "",
	points: 1,
	choices: [
		{ id: 1, text: "", isCorrect: true },
		{ id: 2, text: "", isCorrect: false },
	],
});

export const ExamForm = ({ onCancel, onCreate }) => {
	const [formData, setFormData] = useState({
		courseCode: "",
		type: "qcm",
		startsAt: "",
		endsAt: "",
		title: "",
		description: "",
	});
	const [questions, setQuestions] = useState([EMPTY_QUESTION()]);

	const handleChange = (field) => (e) => {
		setFormData({ ...formData, [field]: e.target.value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!formData.courseCode || !formData.startsAt || !formData.endsAt || !formData.title) {
			return;
		}
		onCreate({ ...formData, questions });
	};

	const addQuestion = () => {
		setQuestions([...questions, EMPTY_QUESTION()]);
	};

	const removeQuestion = (questionId) => {
		setQuestions(questions.filter((q) => q.id !== questionId));
	};

	const updateQuestionStatement = (questionId, statement) => {
		setQuestions(
			questions.map((q) => (q.id === questionId ? { ...q, statement } : q))
		);
	};

	const updateQuestionPoints = (questionId, points) => {
		setQuestions(
			questions.map((q) =>
				q.id === questionId ? { ...q, points: Number(points) } : q
			)
		);
	};

	const addChoice = (questionId) => {
		setQuestions(
			questions.map((q) => {
				if (q.id !== questionId || q.choices.length >= 6) return q;
				return {
					...q,
					choices: [
						...q.choices,
						{ id: Date.now(), text: "", isCorrect: false },
					],
				};
			})
		);
	};

	const removeChoice = (questionId, choiceId) => {
		setQuestions(
			questions.map((q) => {
				if (q.id !== questionId || q.choices.length <= 2) return q;
				const remaining = q.choices.filter((c) => c.id !== choiceId);
				// si on supprime la bonne reponse, on en marque une autre par defaut
				const stillHasCorrect = remaining.some((c) => c.isCorrect);
				return {
					...q,
					choices: stillHasCorrect
						? remaining
						: remaining.map((c, i) => ({ ...c, isCorrect: i === 0 })),
				};
			})
		);
	};

	const updateChoiceText = (questionId, choiceId, text) => {
		setQuestions(
			questions.map((q) =>
				q.id === questionId
					? {
						...q,
						choices: q.choices.map((c) =>
							c.id === choiceId ? { ...c, text } : c
						),
					}
					: q
			)
		);
	};

	const setCorrectChoice = (questionId, choiceId) => {
		setQuestions(
			questions.map((q) =>
				q.id === questionId
					? {
						...q,
						choices: q.choices.map((c) => ({
							...c,
							isCorrect: c.id === choiceId,
						})),
					}
					: q
			)
		);
	};

	return (
		<form className="student-form exam-form" onSubmit={handleSubmit}>
			<h2>Create an exam</h2>

			<div className="form-field">
				<label htmlFor="courseCode">UE *</label>
				<select
					id="courseCode"
					value={formData.courseCode}
					onChange={handleChange("courseCode")}
					required
				>
					<option value="">Select a UE...</option>
					{Object.keys(COURSE_META).map((code) => (
						<option key={code} value={code}>
							{code}
						</option>
					))}
				</select>
			</div>

			<div className="form-field">
				<label>Type *</label>
				<div className="exam-type-choice">
					<label className="type-option">
						<input
							type="radio"
							name="type"
							value="qcm"
							checked={formData.type === "qcm"}
							onChange={handleChange("type")}
						/>
						Multiple-choice questions
					</label>
					<br />
					<label className="type-option disabled">
						<input type="radio" name="type" value="code" disabled />
						Code <span className="coming-soon">(Coming soon)</span>
					</label>
				</div>
			</div>

			<div className="form-field-row">
				<div className="form-field">
					<label htmlFor="startsAt">Starts at *</label>
					<input
						id="startsAt"
						type="datetime-local"
						value={formData.startsAt}
						onChange={handleChange("startsAt")}
						required
					/>
				</div>
				<div className="form-field">
					<label htmlFor="endsAt">Ends at *</label>
					<input
						id="endsAt"
						type="datetime-local"
						value={formData.endsAt}
						onChange={handleChange("endsAt")}
						required
					/>
				</div>
			</div>

			<div className="form-field">
				<label htmlFor="title">Exam title *</label>
				<input
					id="title"
					type="text"
					placeholder="e.g. Midterm exam"
					value={formData.title}
					onChange={handleChange("title")}
					required
				/>
			</div>

			<div className="form-field">
				<label htmlFor="description">Description</label>
				<textarea
					id="description"
					rows={3}
					placeholder="Short description of the exam..."
					value={formData.description}
					onChange={handleChange("description")}
				/>
			</div>

			<div className="questions-section">
				<h3>Questions</h3>

				{questions.map((q, qIndex) => (
					<div key={q.id} className="question-block">
						<div className="question-header">
							<span>Question {qIndex + 1}</span>
							{questions.length > 1 && (
								<button
									type="button"
									className="remove-question-btn"
									onClick={() => removeQuestion(q.id)}
								>
									Remove
								</button>
							)}
						</div>

						<div className="form-field">
							<label>Statement *</label>
							<input
								type="text"
								placeholder="Question text..."
								value={q.statement}
								onChange={(e) => updateQuestionStatement(q.id, e.target.value)}
								required
							/>
						</div>

						<div className="form-field points-field">
							<label>Points</label>
							<input
								type="number"
								min="1"
								value={q.points}
								onChange={(e) => updateQuestionPoints(q.id, e.target.value)}
							/>
						</div>

						<div className="choices-list">
							{q.choices.map((c) => (
								<div key={c.id} className="choice-row">
									<input
										type="radio"
										name={`correct-${q.id}`}
										checked={c.isCorrect}
										onChange={() => setCorrectChoice(q.id, c.id)}
										title="Mark as correct answer"
									/>
									<input
										type="text"
										placeholder="Choice text..."
										value={c.text}
										onChange={(e) =>
											updateChoiceText(q.id, c.id, e.target.value)
										}
										required
									/>
									{q.choices.length > 2 && (
										<button
											type="button"
											className="remove-choice-btn"
											onClick={() => removeChoice(q.id, c.id)}
										>
											✕
										</button>
									)}
								</div>
							))}
						</div>

						{q.choices.length < 6 && (
							<button
								type="button"
								className="add-choice-btn"
								onClick={() => addChoice(q.id)}
							>
								+ Add choice
							</button>
						)}
					</div>
				))}

				<button type="button" className="add-question-btn" onClick={addQuestion}>
					+ Add question
				</button>
			</div>

			<div className="form-actions">
				<button type="button" onClick={onCancel} className="btn-cancel">
					Cancel
				</button>
				<button type="submit" className="btn-create">
					Create exam
				</button>
			</div>
		</form>
	);
}