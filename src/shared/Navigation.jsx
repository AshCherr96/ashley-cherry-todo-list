import { NavLink } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

function Navigation() {
  const { isAuthenticated } = useAuth();

  // Dynamic styling function provided by NavLink's style prop callback
  const navLinkStyle = ({ isActive }) => {
    return {
      fontWeight: isActive ? 'bold' : 'normal',
      textDecoration: isActive ? 'underline' : 'none',
    };
  };

  // Inline layout styling for the horizontal navigation bar
  const navListStyle = {
    listStyle: 'none',
    display: 'flex',
    gap: '1rem',
    padding: 0,
    margin: 0,
  };

  return (
    <nav>
      <ul style={navListStyle}>
        {/* Public Route available to everyone */}
        <li>
          <NavLink to="/about" style={navLinkStyle}>
            About
          </NavLink>
        </li>

        {/* Conditional Routes for Authenticated Users */}
        {isAuthenticated && (
          <>
            <li>
              <NavLink to="/todos" style={navLinkStyle}>
                Todos
              </NavLink>
            </li>
            <li>
              <NavLink to="/profile" style={navLinkStyle}>
                Profile
              </NavLink>
            </li>
          </>
        )}

        {/* Conditional Route for Unauthenticated Users */}
        {!isAuthenticated && (
          <li>
            <NavLink to="/login" style={navLinkStyle}>
              Login
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navigation;