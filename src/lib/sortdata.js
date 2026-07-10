export function sortData(
  data,
  sortField,
  sortOrder
) {
  return [...data].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (aValue === undefined || aValue === null) {
      aValue = "";
    }

    if (bValue === undefined || bValue === null) {
      bValue = "";
    }

    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase();
    }

    if (typeof bValue === "string") {
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue)
      return sortOrder === "asc" ? -1 : 1;

    if (aValue > bValue)
      return sortOrder === "asc" ? 1 : -1;

    return 0;
  });
}