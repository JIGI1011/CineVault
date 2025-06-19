
import { Link } from "react-router-dom";
import "../css/Navbar.css";
import { auth } from "../services/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";

function NavBar() {
  const [user] = useAuthState(auth);

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="brand-link">
          <img src="/CineVault_Logo.svg" alt="CineVault Logo" className="logo" />
          <span className="brand-text">CineVault</span>
        </Link>
      </div>
      <div className="navbar-links">
        <Link to="/User" className="nav-link">
        {user && (
          <span className="navbar-user">
            Welcome, {user.displayName || user.email.split("@")[0]}!
          </span>
        )}
        </Link>
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/favorites" className="nav-link">Favorites</Link>
        <Link to="/watchlist" className="nav-link">Watchlist</Link>

        {user ? (
          <>
            <button className="logout-button" onClick={handleLogout}>Logout</button>

          </>
        ) : (
          <Link to="/login" className="nav-button">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
