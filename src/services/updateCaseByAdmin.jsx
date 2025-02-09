const API_URL = import.meta.env.VITE_API_URL;

export default async function updateCaseByAdmin(data) {
  try {
    const response = await fetch(`${API_URL}/api/admin/cases/${data._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to update case. Please try again.");
    }

    const responseData = await response.json();
    return responseData.message || "Case updated successfully";
  } catch (error) {
    console.error("Error updating case:", error);
    throw error;
  }
}
