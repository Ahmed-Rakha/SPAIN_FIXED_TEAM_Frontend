const API_URL = import.meta.env.VITE_API_URL;
export const getHandledCasesByUsersApi = async function () {
    try {
      const response = await fetch(`${API_URL}/api/admin/cases`, {
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