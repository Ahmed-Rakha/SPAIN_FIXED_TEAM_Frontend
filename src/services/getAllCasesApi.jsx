const API_URL = import.meta.env.VITE_API_URL;

export default async function getAllCasesApi() {
  try {
    const response = await fetch(`${API_URL}/api/user/cases`, { 
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    if (response.status === 404) {
      throw new Error("Usuario no encontrado. Por favor, intenta de nuevo o contacta al administrador.");
    }
    if(response.status === 401) {
      throw new Error("No autorizado. Por favor, inicia sesión e intenta de nuevo.");
    }
    if (!response.ok) {
      throw new Error('Failed to fetch cases. Please try again.');
    }
    const { data } = await response.json();
    console.log(data.cases);

    return data.cases;
  } catch (error) {
    console.error('Error fetching cases:', error);
    throw error;
  }
}
