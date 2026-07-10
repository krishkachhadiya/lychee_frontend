export function buildTree(categories, parent = null) {
  return categories
    .filter((item) =>
      parent === null
        ? item.parent === null
        : String(item.parent) === String(parent)
    )
    .map((item) => ({
      ...item,
      children: buildTree(categories, item._id),
    }));
}

export function getCategoryPath(categories, categoryId) {
  const path = [];

  let current = categories.find(
    (item) => String(item._id) === String(categoryId)
  );

  while (current) {
    path.unshift(current.title);

    current = categories.find(
      (item) => String(item._id) === String(current.parent)
    );
  }

  return path.join(" > ");
}

/**
 * Returns the root category object
 */
export function getRootCategory(categories, categoryId) {
  let current = categories.find(
    (item) => String(item._id) === String(categoryId)
  );

  if (!current) return null;

  while (current.parent) {
    current = categories.find(
      (item) => String(item._id) === String(current.parent)
    );

    if (!current) break;
  }

  return current || null;
}

/**
 * Returns only the root category ID
 */
export function getRootCategoryId(categories, categoryId) {
  const root = getRootCategory(categories, categoryId);
  return root ? String(root._id) : null;
}

/**
 * Returns only the root category title
 */
export function getRootCategoryTitle(categories, categoryId) {
  const root = getRootCategory(categories, categoryId);
  return root ? root.title : "";
}