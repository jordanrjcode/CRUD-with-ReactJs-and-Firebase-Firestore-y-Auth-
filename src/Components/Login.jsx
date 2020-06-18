import React from "react";
import { db, auth } from "../firebase";
import { withRouter } from "react-router-dom";
const Login = (props) => {
  // Creando los states de los campos
  const [email, setEmail] = React.useState("");
  const [pass, setPass] = React.useState("");
  const [mensaje, setMensaje] = React.useState("");
  const [esRegistro, setEsRegistro] = React.useState(true);

  const registrarUsuario = React.useCallback(async () => {
    try {
      const res = await auth.createUserWithEmailAndPassword(email, pass);
      await db.collection("users").doc(res.user.uid).set({
        email: res.user.email,
        uid: res.user.uid,
      });
      await db.collection(res.user.uid).add({
        name: "Tarea de ejjemplo",
        fecha: Date.now(),
      });
      setEmail("");
      setPass("");
      setMensaje("");
      props.history.push("/admin");
    } catch (error) {
      console.log(error);
      setMensaje(error.message);
    }
  }, [email, pass, props.history]);

  const iniciarSesion = React.useCallback(async () => {
    try {
      await auth.signInWithEmailAndPassword(email, pass);
      setEmail("");
      setPass("");
      setMensaje("");
      props.history.push("/admin");
    } catch (error) {
      setMensaje(error.message);
      return;
    }
  }, [email, pass, props.history]);

  //Funcion para validar los datos del formulario
  const procesarDatos = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setMensaje("Ingrese un email");
      return;
    }
    if (!pass.trim()) {
      setMensaje("Ingrese una contraseña");
      return;
    }
    if (pass.length < 6) {
      setMensaje("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    setMensaje("");
    console.log("validando todo");
    if (esRegistro) {
      registrarUsuario();
    } else {
      iniciarSesion();
    }
  };

  return (
    <div className="container mx-auto mt-10">
      <h3 className="text-center font-bold text-2xl mb-10">
        {esRegistro ? "Registro de usuarios" : "Inicia sesión"}
      </h3>
      <hr />
      <form
        onSubmit={procesarDatos}
        className="mt-10 w-11/12 md:w-5/6 lg:w-3/5 xl:w-1/2 mx-auto"
      >
        {mensaje.length > 0 ? (
          <div className="p-4 bg-red-300 text-red-600 block w-3/4 mx-auto mb-4">
            {mensaje}
          </div>
        ) : null}
        <input
          type="email"
          placeholder="Ingrese un email"
          name="email"
          className="focus:outline-none bg-transparent text-xl border-b-2 border-blue-400 w-3/4 mx-auto mb-5 block"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <input
          type="password"
          placeholder="Ingrese su contraseña"
          name="password"
          className="focus:outline-none bg-transparent text-xl border-b-2 border-blue-400 w-3/4 mx-auto mb-5 block"
          onChange={(e) => setPass(e.target.value)}
          value={pass}
        />
        <button
          type="submit"
          className="block p-4 border-b-4 bg-gray-700 border-gray-900 rounded text-white w-3/4 mb-5 mx-auto"
        >
          {esRegistro ? "Registrar" : "Acceder"}
        </button>
        <button
          type="button"
          onClick={() => setEsRegistro(!esRegistro)}
          className="block p-3 border-b-4 bg-blue-500 border-blue-700 rounded text-white w-3/4 mx-auto"
        >
          {esRegistro ? "¿Ya tienes una cuenta?" : "¿No estas registrado?"}
        </button>
      </form>
    </div>
  );
};

export default withRouter(Login);
