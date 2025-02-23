const API_URL = import.meta.env.VITE_API_URL;

export default async function deleteCaseByAdmin(id) {
  try {
    const response = await fetch(`${API_URL}/api/admin/cases/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ deletedBy: "admin" }),
    });

    if (!response.ok) {
      // Check if the response is not ok
      const errorData = await response.json(); // Parse the error response
      throw new Error(
        errorData.message ||
          "No se pudo eliminar el caso. Por favor, intenta de nuevo."
      );
    }

    return "Caso eliminado exitosamente"; // Return the success message if the response is ok
  } catch (error) {
    console.error("Error deleting case:", error);
    throw error; // Rethrow the error to be handled elsewhere
  }
}
