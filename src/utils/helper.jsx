export function generateSummaryArrayForHandledCasesByUsers(cases) {
  const summaryArray = [];

  cases.forEach((caseItem) => {
    caseItem.userCases.forEach((userCase) => {
      const { dateProgress, idCase, status, createdBy } = userCase;
      const normalizedStatus = status.toLowerCase();

      const entry = {
        dateProgress,
        idCase,
        statusCounts: {
          [normalizedStatus]: 1,
        },
        userName: createdBy,
      };

      const existingEntryIndex = summaryArray.findIndex(
        (item) =>
          item.dateProgress === dateProgress &&
          item.idCase === idCase &&
          item.userName === createdBy
      );

      if (existingEntryIndex !== -1) {
        const existingEntry = summaryArray[existingEntryIndex];
        existingEntry.statusCounts[normalizedStatus] =
          (existingEntry.statusCounts[normalizedStatus] || 0) + 1;
      } else {
        summaryArray.push(entry);
      }
    });
  });

  return summaryArray;
}

export function processData(casesByUserAndId) {
    const dataBar = [];
  
    // Loop through cases by ID
    for (const [idCase, users] of Object.entries(casesByUserAndId)) {
      // For this example, let's set a static date for demonstration
      const dateProgress = "2024-10-27"; // Replace with actual logic to get the date if necessary
  
      for (const [user, statuses] of Object.entries(users)) {
        const entry = { idCase, user, dateProgress }; // Include dateProgress in the entry
  
        // Add each status as a key with its count as the value
        for (const [status, count] of Object.entries(statuses)) {
          entry[status] = count;
        }
  
        dataBar.push(entry);
      }
    }
  
    return dataBar;
  }
  