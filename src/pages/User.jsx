import { auth } from "../services/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { deleteAccount } from "../services/userservices";
import { useState } from "react";
import "../css/User.css"; 

function UserProfile() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleDeleteAccount = async () => {
    if (!password) {
      setError("Password cannot be empty.");
      return;
    }

    try {
      await deleteAccount(password);
      alert("Account deleted successfully.");
      setShowModal(false);
      navigate("/login"); 
    } catch (err) {
      setError("Failed to delete account: " + err.message);
    }
  };

  if (!user) return <p>Loading user data...</p>;

  return (
    <div className="user-profile">
      <h2>Account Details</h2>
      <p><strong>Email:</strong> {user.email}</p>
      <button onClick={() => setShowModal(true)} className="delete-button">
        Delete My Account
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Account Deletion</h3>
            <p>Enter your password to delete your account:</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
            {error && <p className="error">{error}</p>}
            <div className="modal-actions">
              <button onClick={handleDeleteAccount}>Confirm</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfile;
