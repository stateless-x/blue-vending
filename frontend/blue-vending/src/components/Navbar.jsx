import { NavLink } from "react-router-dom";
import "../styles/navbar.scss";
export const Navbar = () => {
  return (
    <nav>
      <NavLink className="nav-item" to="/">
        Vending
      </NavLink>
      <NavLink className="nav-item" to="/manage">
        Manage
      </NavLink>
    </nav>
  );
};
