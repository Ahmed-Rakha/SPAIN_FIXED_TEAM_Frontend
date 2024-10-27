const API_URL = import.meta.env.VITE_API_URL;
import { toast } from "react-toastify";
export const logout = async () => {
  try {
    const response = await fetch(`${API_URL}/api/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(
        "No se pudo cerrar la sesión. Por favor, inténtalo de nuevo."
      );
    }
    return true;
  } catch (error) {
    console.error("Error logging out:", error);
    toast.error(error.message);
    throw error;
  }
};
