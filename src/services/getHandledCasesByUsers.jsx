const API_URL = import.meta.env.VITE_API_URL;

// export default async function getHandledCasesByUsers(filter) {
//   console.log("my filter", filter);
//   try {
//     const response = await fetch(`${API_URL}/api/user/cases`, {
//       // method: 'POST',
//       headers: {
//         "Content-Type": "application/json",
//       },
//       credentials: "include",
//       // body: JSON.stringify({
//       //   filterBy: filter.filterBy,
//       //   projection: filter.projection,
//       // }),
//     });
//     if (response.status === 403) {
//       throw new Error("No tiene permisos para acceder a esta sección");
//     }
//     if (!response.ok) {
//       throw new Error("Failed to fetch cases. Please try again.");
//     }

//     const { data } = await response.json();
//     console.log(data.cases);

//     return data.cases;
//   } catch (error) {
//     console.error("Error fetching cases:", error);
//     throw error;
//   }
// }

export default async function getHandledCasesByUsers() {
  try {
    const response = await fetch(`${API_URL}/api/user/handled-cases`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorType = response.status;
      const errorMessages = {
        404: "Usuario no encontrado.",
        401: "No autorizado.",
        403: "No tiene permisos para acceder a esta sección.",
      };

      const errorMessage = errorMessages[errorType] || "Error desconocido.";
      const error = new Error(errorMessage);
      error.errorType = errorType;
      throw error;
    }
    const { data } = await response.json();
    console.log(data.cases);

    return data.cases;
  } catch (error) {
    console.error("Error fetching cases:", error);
    console.log("error message", error.message);
    console.log(!error.message);

   
    if (!error.message) {
      const networkError = new Error("Error de conexión. Intenta más tarde.");
      networkError.errorType = "network";
      throw networkError;
    } else {
      throw error;
    }
  }
}

