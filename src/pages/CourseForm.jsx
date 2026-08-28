import { useState } from "react";
import { COURSE_META } from "./courseMeta.js";

export function CourseForm({ onCancel, onCreate, initialData }) {
	const [formData, setFormData] = useState(
		initialData ?? { code: "", name: "", description: "" }
	);

	const handleChange = (field) => (e) => {
		setFormData({ ...formData, [field]: e.target.value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!formData.code) return;
		onCreate(formData);
	};

	return (
		<form className="student-form" onSubmit={handleSubmit}>
			<h2>{initialData ? "Edit course" : "Create a course"}</h2>

			<div className="form-field">
				<label htmlFor="code">Course code *</label>
				<select
					id="code"
					value={formData.code}
					onChange={handleChange("code")}
					required
				>
					<option value="">Select a code...</option>
					{Object.keys(COURSE_META).map((code) => (
						<option key={code} value={code}>
							{COURSE_META[code].label}
						</option>
					))}
				</select>
			</div>

			<div className="form-field">
				<label htmlFor="name">Chapter name *</label>
				<input
					id="name"
					type="text"
					placeholder="e.g. Inheritance and polymorphism"
					value={formData.name}
					onChange={handleChange("name")}
					required
				/>
			</div>

			<div className="form-field">
				<label htmlFor="description">Description *</label>
				<textarea
					id="description"
					rows={6}
					placeholder="Write the full course content here..."
					value={formData.description}
					onChange={handleChange("description")}
					required
				/>
			</div>

			<div className="form-actions">
				<button type="button" onClick={onCancel} className="btn-cancel">
					Cancel
				</button>
				<button type="submit" className="btn-create">
					{initialData ? "Save" : "Create"}
				</button>
			</div>
		</form>
	);
}