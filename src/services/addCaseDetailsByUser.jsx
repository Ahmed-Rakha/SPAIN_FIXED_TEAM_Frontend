const API_URL = import.meta.env.VITE_API_URL;

export const addCaseDetailsByUser = async (data) => {
  try {
    const response = await fetch(`${API_URL}/api/user/cases`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message ||
          "No se pudo agregar el caso. Por favor, intenta de nuevo."
      );
    }

    const result = await response.json();
    return result.data.newCaseGrande;
  } catch (error) {
    console.error("Error adding case:", error);
    throw error;
  }
};

export const editStatusCASE = async ({ query, modifiedData }) => {
  console.log("welcomeeee");

  console.log(`${API_URL}/api/user/cases?${query}`);
  const queryString = new URLSearchParams(query).toString();

  console.log("modifiedData", modifiedData);
  console.log("queryString", queryString);

  try {
    const response = await fetch(`${API_URL}/api/user/cases?${queryString}`, {
      method: "PATCH",
      body: JSON.stringify(modifiedData),
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      credentials: "include",
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message ||
          "No se pudo editar el caso. Por favor, intenta de nuevo."
      );
    }
    const result = await response.json();
    console.log("resultttttt", result.data.caseGrande);

    return result.data.caseGrande;
  } catch (error) {
    console.error("Error editing case:", error);
    throw error;
  }
};
