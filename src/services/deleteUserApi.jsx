const API_URL = 'http://localhost:3001/';
export default async function deleteUserApi(id) {
  try {
    const response = await fetch(`${API_URL}api/admin/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ deletedBy: 'admin' }),
    });

    if (!response.ok) {
      throw new Error('Failed to delete user. Please try again.');
    }

    // Handle the 204 No Content response
    if (response.status === 204) {
      return 'Usuario eliminado exitosamente'; // Return the success message
    }

    // If the response is not 204, parse the JSON body
    const data = await response.json();
    if (!data.message) {
      throw new Error('Failed to delete user. Please try again.');
    }
    return data.message;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error; // Rethrow the error to be handled elsewhere
  }
}
