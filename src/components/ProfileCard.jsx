import "./ProfileCard.css";

export function ProfileCard({ person, emptyEmblemsText }) {
  return (
    <div className="profile-card">
      <div className="profile-photo">
        {person.photoUrl ? (
          <img src={person.photoUrl} alt={person.firstName} />
        ) : (
          <span className="profile-photo-placeholder">
            {person.firstName?.[0]}
            {person.lastName?.[0]}
          </span>
        )}
      </div>

      <h2 className="profile-name">{person.lastName}</h2>
      <p className="profile-firstname">{person.firstName}</p>

      <div className="profile-info-block">
        <div className="profile-info-row">
          <span className="profile-info-label">Email</span>
          <span className="profile-info-value">{person.email}</span>
        </div>
        {person.age && (
          <div className="profile-info-row">
            <span className="profile-info-label">Age</span>
            <span className="profile-info-value">{person.age}</span>
          </div>
        )}
        {person.gender && (
          <div className="profile-info-row">
            <span className="profile-info-label">Gender</span>
            <span className="profile-info-value">{person.gender}</span>
          </div>
        )}
        {person.role && (
          <div className="profile-info-row">
            <span className="profile-info-label">Role</span>
            <span className="profile-info-value">{person.role}</span>
          </div>
        )}
      </div>

      <div className="profile-emblems">
        <p>{emptyEmblemsText}</p>
      </div>
    </div>
  );
}