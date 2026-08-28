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

      {/* Questions viennent en partie 2 */}

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