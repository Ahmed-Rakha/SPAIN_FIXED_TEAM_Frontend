const API_URL = import.meta.env.VITE_API_URL;
export default async function getAllUsersApi() {
  try {
    const response = await fetch(`${API_URL}/api/admin/users`);
    if (!response.ok) {
      throw new Error('No se pudieron obtener los usuarios. Por favor, intenta de nuevo o contacta al administrador.');
    }
    const { data } = await response.json();    
    return data.users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}
