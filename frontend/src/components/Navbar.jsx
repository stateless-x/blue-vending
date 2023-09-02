import { NavLink } from "react-router-dom";
import "../styles/navbar.scss";
export const Navbar = () => {
  return (
    <nav>
      <NavLink className="nav-item" to="/">
        Sales
      </NavLink>
      <NavLink className="nav-item" to="/manage">
        Monitor
      </NavLink>
    </nav>
  );
};
