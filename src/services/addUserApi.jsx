const API_URL = import.meta.env.VITE_API_URL;
export default async function addUserApi(data) {
  try {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    if (response.status === 409) {
      let { message } = await response.json();
      throw new Error(`Fallido al agregar usuario. ${message}.`);
    }

    if (!response.ok) {
      throw new Error("Failed to add user. Please try again.");
    }
    let { message } = await response.json();
    if (!message) {
      throw new Error("Failed to add user. Please try again.");
    }
    message = "Usuario agregado exitosamente";
    return message;
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
}
