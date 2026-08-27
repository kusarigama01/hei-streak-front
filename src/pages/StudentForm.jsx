import { useState } from "react";
import "./StudentForm.css";

export const StudentForm = ({ onCancel, onCreate, initialData }) => {
	const [formData, setFormData] = useState(
		initialData ?? {
			lastName: "",
			firstName: "",
			birthDate: "",
			birthPlace: "",
			gender: "",
			cin: "",
			email: "",
			password: "",
			address: "",
			avatarFile: null,
			avatarPreview: null,
		}
	);

	const handleChange = (field) => (e) => {
		setFormData({ ...formData, [field]: e.target.value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		onCreate(formData);
	};

	return (
		<form className="student-form" onSubmit={handleSubmit}>
			<h2>{initialData ? "Edit student" : "Create a student"}</h2>

			<div className="form-field">
				<label htmlFor="lastName">Last name *</label>
				<input
					id="lastName"
					type="text"
					placeholder="e.g. Rakoto"
					value={formData.lastName}
					onChange={handleChange("lastName")}
					required
				/>
				<span className="field-hint">Required.</span>
			</div>

			<div className="form-field">
				<label htmlFor="firstName">First name(s)</label>
				<input
					id="firstName"
					type="text"
					placeholder="e.g. Jean Marc"
					value={formData.firstName}
					onChange={handleChange("firstName")}
				/>
				<span className="field-hint">Optional.</span>
			</div>

			<div className="form-field">
				<label htmlFor="avatar">Avatar</label>
				<input
					id="avatar"
					type="file"
					accept="image/*"
					onChange={(e) => {
						const file = e.target.files[0];
						if (file) {
							setFormData({
								...formData,
								avatarFile: file,
								avatarPreview: URL.createObjectURL(file),
							});
						}
					}}
				/>
				{formData.avatarPreview && (
					<img
						src={formData.avatarPreview}
						alt="Preview"
						className="avatar-preview"
					/>
				)}
				<span className="field-hint">Optional. JPG or PNG.</span>
			</div>

			<div className="form-field">
				<label htmlFor="birthDate">Date of birth</label>
				<input
					id="birthDate"
					type="date"
					value={formData.birthDate}
					onChange={handleChange("birthDate")}
				/>
			</div>

			<div className="form-field">
				<label htmlFor="birthPlace">Place of birth</label>
				<input
					id="birthPlace"
					type="text"
					placeholder="e.g. Antananarivo"
					value={formData.birthPlace}
					onChange={handleChange("birthPlace")}
				/>
			</div>
			<div className="form-field">
				<label htmlFor="address">Address</label>
				<input
					id="address"
					type="text"
					placeholder="e.g. Lot II A 12, Antananarivo"
					value={formData.address}
					onChange={handleChange("address")}
				/>
			</div>

			<div className="form-field">
				<label htmlFor="gender">Gender</label>
				<select
					id="gender"
					value={formData.gender}
					onChange={handleChange("gender")}
				>
					<option value="">Select...</option>
					<option value="male">Male</option>
					<option value="female">Female</option>
					<option value="bisexual">Bisexual</option>
					<option value="other">Other</option>
				</select>
			</div>

			<div className="form-field">
				<label htmlFor="cin">National ID (CIN)</label>
				<input
					id="cin"
					type="text"
					placeholder="e.g. 101112013014"
					value={formData.cin}
					onChange={handleChange("cin")}
				/>
				<span className="field-hint">Optional.</span>
			</div>

			<div className="form-field">
				<label htmlFor="email">Email *</label>
				<input
					id="email"
					type="email"
					placeholder="e.g. jean.rakoto@hei.mg"
					value={formData.email}
					onChange={handleChange("email")}
					required
				/>
			</div>

			<div className="form-field">
				<label htmlFor="password">Initial password *</label>
				<input
					id="password"
					type="password"
					placeholder="Temporary password"
					value={formData.password}
					onChange={handleChange("password")}
					required
				/>
				<span className="field-hint">
					The student will be able to change it later (admin-managed reset only).
				</span>
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