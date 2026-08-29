import "./ProfileCard.css";

export function ProfileCard({ person, emptyEmblemsText, examHistory }) {
  return (
    <div className="profile-card">
      <div className="profile-photo">
        {person.avatarPreview ? (
          <img src={person.avatarPreview} alt={person.firstName} />
        ) : (
          <span className="profile-photo-placeholder">
            {person.firstName?.[0] ?? person.lastName?.slice(0, 2)}
          </span>
        )}
      </div>

      <h2 className="profile-name">{person.lastName}</h2>
      {person.firstName && <p className="profile-firstname">{person.firstName}</p>}

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
        <h3 className="profile-history-title">Exam History</h3>
        {examHistory && examHistory.length > 0 ? (
          <div className="profile-history-list">
            {examHistory.map((h) => (
              <div key={h.id} className="profile-history-row">
                <div className="profile-history-main">
                  <span className="profile-history-code">{h.courseCode}</span>
                  <span className="profile-history-title-text">{h.examTitle}</span>
                </div>
                <div className="profile-history-meta">
                  <span className="profile-history-score">
                    {h.score}/{h.totalPoints}
                  </span>
                  <span className="profile-history-date">
                    {new Date(h.submittedAt).toLocaleString("en-GB")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>{emptyEmblemsText}</p>
        )}
      </div>
    </div>
  );
}