import React from "react";
import { NavLink, Link, withRouter } from "react-router-dom";
import { auth } from "../firebase";
const Navbar = (props) => {
  const cerrarSesion = async () => {
    try {
      await auth.signOut();
      console.log("Exito al cerrar Sesion");
      props.history.push("/login");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <nav className="flex flex-col lg:flex-row items-center justify-between bg-gray-700 p-6">
      <div className="text-white">
        <Link className="font-bold text-2xl my-2 uppercase" to="/">
          Auth
        </Link>
      </div>
      <div className="flex flex-col lg:flex-row justify-between lg:ml-auto items-center box-border">
        <NavLink
          className="text-white p-3 rounded block box-border mr-2"
          activeClassName="bg-gray-900 font-bold"
          to="/"
          exact
        >
          Inicio
        </NavLink>
        {props.firebaseUser ? (
          <NavLink
            className="text-white p-3 rounded block box-border mr-2"
            activeClassName="bg-gray-900 font-bold"
            to="/admin"
          >
            Admin
          </NavLink>
        ) : null}
        {props.firebaseUser !== null ? (
          <button
            onClick={() => cerrarSesion()}
            className="hover:bg-gray-900 font-bold text-white p-3 rounded block box-border"
          >
            Cerrar Sesion
          </button>
        ) : (
          <NavLink
            className="text-white p-3 rounded block box-border"
            activeClassName="bg-gray-900 font-bold"
            to="/login"
          >
            Login
          </NavLink>
        )}
      </div>
    </nav>
  );
};

export default withRouter(Navbar);
