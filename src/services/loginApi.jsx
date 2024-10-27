const API_URL = import.meta.env.VITE_API_URL;

export default async function loginApi(data) {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (response.status === 401) {
      const errorData = await response.json();
      throw new Error(
        errorData.message ||
          "Credenciales incorrectas, por favor, intenta de nuevo."
      );
    }

    if (!response.ok) {
      throw new Error(
        "No se pudo iniciar sesión. Por favor, inténtalo de nuevo."
      );
    }
    const { role } = await response.json();
    localStorage.setItem("role", role);
    return role;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
}

export const logoutApi = async () => {
  try {
    const response = await fetch(`${API_URL}api/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to logout. Please try again.");
    }
    return "Logout successful";
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};

export const registerApi = async (data) => {
  try {
    const response = await fetch(`${API_URL}api/auth/register`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to register. Please try again.");
    }
    const { message } = await response.json();
    return message;
  } catch (error) {
    console.error("Error registering:", error);
    throw error;
  }
};

export const forgotPasswordApi = async (data) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(
        errorData.message ||
          "No se pudo enviar el correo. Por favor, intenta de nuevo."
      );
    }
    const { message } = await response.json();
    return message;
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
};
