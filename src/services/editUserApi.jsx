const API_URL = import.meta.env.VITE_API_URL;
export default async function editUserApi(data) {
  const formData = new FormData();
  

  try {
    const response = await fetch(`${API_URL}/api/admin/users/${data._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    // Check if the user was not found
    if (response.status === 404) {
      throw new Error('Usuario no encontrado. Por favor, intenta de nuevo.');
    }

    // Check if the response is not ok
    if (!response.ok) {
      const errorData = await response.json(); // Parse the error response
      throw new Error(
        errorData.message ||
          'No se pudo editar el usuario. Por favor, intenta de nuevo.'
      );
    }

    const responseData = await response.json(); // Parse the success response
    return (
      responseData.message || 'Datos del usuario actualizados exitosamente'
    ); // Use the returned message
  } catch (error) {
    console.error('Error editing user:', error);
    throw error; // This will be caught in the onError callback
  }
}
