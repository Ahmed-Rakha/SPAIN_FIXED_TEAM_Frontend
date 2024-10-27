const API_URL = import.meta.env.VITE_API_URL;

export default async function addCaseByAdminApi(data) {
  try {
    const response = await fetch(`${API_URL}/api/admin/cases`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      credentials: 'include',
    });

    // Handle the response for duplicate cases
    if (response.status === 409) {
      const { message } = await response.json();
      throw new Error(`Fallido al agregar caso: ${message}`);
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Fallido al agregar caso: ${errorData.message || 'Por favor, intenta de nuevo.'}`
      );
    }

    const result = await response.json();
    return result.data.newCaseGrande;
  } catch (error) {
    console.error('Error adding case:', error);
    throw error;
  }
}
