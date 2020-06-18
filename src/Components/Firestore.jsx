import React from "react";
import { db } from "../firebase";
import moment from "moment";
import "moment/locale/es";

function Firestore(props) {
  // Crearemos un state para pintar las tareas en la pantalla
  const [tareas, setTareas] = React.useState([]);
  const [tarea, setTarea] = React.useState("");
  const [modoEdicion, setModoEdicion] = React.useState(false);
  const [id, setId] = React.useState("");
  React.useEffect(() => {
    // Para conectar la base de datos usaremos una funcion
    const obtenerDatos = async () => {
      try {
        // Ejecutamos el metodo get lo podemos hacer dentro del try o podemos usar promesas con then
        const data = await db
          .collection(props.user.uid)
          .orderBy("fecha", "desc")
          .get();

        // Una vez obtenemos la colleccion en este caso el id del usuario la mostramos en consola
        const arrayData = data.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTareas(arrayData);
      } catch (error) {
        console.log(error);
      }
    };
    // Llamamos a la funcion la ejecutamos dentro del useEffect para que se ejecute una vez y no generar un bucle infinito
    obtenerDatos();
  }, [props.user.uid]);
  const aggTarea = async (e) => {
    e.preventDefault();
    if (!tarea.trim()) {
      console.log("Esta vacio, complete el campo");
      return;
    }
    try {
      const nuevaTarea = {
        name: tarea,
        fecha: Date.now(),
      };
      const data = await db.collection(props.user.uid).add(nuevaTarea);
      setTareas([...tareas, { ...nuevaTarea, id: data.id }]);
      setTarea("");
    } catch (error) {
      console.log(error);
    }
    console.log(tarea);
  };
  const eliminarTarea = async (id) => {
    try {
      await db.collection(props.user.uid).doc(id).delete();

      const arrayFiltrado = tareas.filter((tarea) => tarea.id !== id);
      setTareas(arrayFiltrado);
    } catch (error) {
      console.log(error);
    }
  };
  const activarEdicion = (item) => {
    setModoEdicion(true);
    setTarea(item.name);
    setId(item.id);
  };
  const editarTarea = async (e) => {
    e.preventDefault();
    if (!tarea.trim()) {
      return;
    }
    try {
      await db.collection(props.user.uid).doc(id).update({
        name: tarea,
      });
      const arrayEditado = tareas.map((item) =>
        item.id === id ? { id: item.id, name: tarea, fecha: item.fecha } : item
      );
      setTareas(arrayEditado);
      setTarea("");
      setId("");
      setModoEdicion(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="container mx-auto">
      <div className="crud lg:flex lg:justify-between mt-10">
        <div className="tareas w-full lg:w-1/2">
          {tareas.length > 0 ? (
            <h2 className="text-center text-2xl font-bold">Lista de tareas</h2>
          ) : (
            <h2 className="text-center text-2xl font-bold">No hay tareas</h2>
          )}
          {tareas.map((tarea) => (
            <div
              key={tarea.id}
              className="w-11/12 lg:w-3/4 mx-auto p-4 box-border mb-2 flex flex-col lg:flex-row items-center rounded bg-blue-200"
            >
              <p className="w-full text-center lg:text-left lg:w-3/4 mb-5 lg:m-0">
                {tarea.name} - {moment(tarea.fecha).format("L")} a las{" "}
                {moment(tarea.fecha).format("LT")}
              </p>
              <div className="div-buttons mx-auto flex flex-shrink">
                <button
                  className="rounded bg-orange-400 border border-b-4 border-orange-600 text-white p-4"
                  onClick={() => activarEdicion(tarea)}
                >
                  Editar
                </button>
                <button
                  className="rounded bg-red-400 border border-b-4 border-red-600 text-white p-4 ml-2 "
                  onClick={() => eliminarTarea(tarea.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="w-full lg:w-1/2">
          <h2 className="text-center text-2xl font-bold">
            {modoEdicion ? "Editar Tarea" : "Formulario"}
          </h2>
          <form
            onSubmit={modoEdicion === true ? editarTarea : aggTarea}
            className="w-3/4 mx-auto"
          >
            <input
              type="text"
              name="name"
              className="focus:outline-none w-full bg-gray-300 p-4 border mb-3"
              placeholder="Ingrese el titulo de su tarea"
              onChange={(e) => setTarea(e.target.value)}
              value={tarea}
            />
            {modoEdicion === true ? (
              <button
                type="submit"
                className="block px-4 py-3 mx-auto text-white rounded bg-yellow-400 border border-b-4 border-orange-600"
              >
                Editar
              </button>
            ) : (
              <button
                type="submit"
                className="block px-4 py-3 mx-auto text-white rounded bg-green-400 border border-b-4 border-green-600"
              >
                Agregar
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Firestore;
