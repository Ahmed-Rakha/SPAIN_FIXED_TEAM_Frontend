const API_URL = import.meta.env.VITE_API_URL;
console.log(API_URL);

export const getProfileDetails = async function () {
  try {
    const response = await fetch(`${API_URL}/api/auth/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (response.status === 404) {
      throw new Error("Usuario no encontrado. Por favor, intenta de nuevo o contacta al administrador.");
    }
    if(response.status === 401) {
      throw new Error("No autorizado. Por favor, inicia sesión e intenta de nuevo.");
    }
    if (!response.ok) {
      throw new Error("No se pudo obtener el perfil. Por favor, intenta de nuevo o contacta al administrador.");
    }

    const { data } = await response.json();

    return data.user;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

//  update profile

export const updateProfile = async function (data) {
  console.log("data", data);

  const formData = new FormData();
  const isFile = data instanceof File;

  if (isFile) {
    formData.append("picture", data);
  }

  const headers = isFile ? {} : { "Content-Type": "application/json" };

  try {
    const response = await fetch(`${API_URL}/api/auth/profile`, {
      method: "PATCH",
      headers,
      body: isFile ? formData : JSON.stringify(data),
      credentials: "include",
    });

    if (response.status === 404) {
      throw new Error("Usuario no encontrado. Por favor, intenta de nuevo.");
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message ||
          "No se pudo editar el usuario. Por favor, intenta de nuevo."
      );
    }

    const responseData = await response.json();

    return (
      responseData.data.user || "Datos del usuario actualizados exitosamente"
    );
  } catch (error) {
    console.error("Error editing user:", error);
    throw error;
  }
};

// change password

export const changePassword = async function (data) {
  try {
    const response = await fetch(`${API_URL}/api/auth/change-password`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });

    if (response.status === 404) {
      throw new Error(
        "Usuario no encontrado. Por favor, intenta de nuevo o contacta al administrador."
      );
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message ||
          "No se pudo editar el usuario. Por favor, intenta de nuevo."
      );
    }

    const responseData = await response.json();

    return responseData.message || "Contraseña actualizada exitosamente";
  } catch (error) {
    console.error("Error editing user:", error);
    throw error;
  }
};
