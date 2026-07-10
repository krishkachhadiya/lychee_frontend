// ======================
// GENERATE SLUG
// ======================

export function generateSlug(text = "") {

  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

}

// ======================
// VALIDATE SLUG
// ======================

export function isValidSlug(slug = "") {

  // BLOCK EMPTY

  if (!slug) {

    return false;
  }
  // BLOCK NUMBER ONLY

  if (/^[0-9]+$/.test(slug)) {

    return false;
  }
  return true;
}

// ======================
// UNIQUE SLUG CHECK
// ======================

export function getUniqueSlug(
  slug,
  items = [],
  currentId = null
) {

  const alreadyExists =
    items.some(

      (item) =>

        item.slug === slug &&

        item.id !== currentId
    );




  if (
    alreadyExists
  ) {

    return null;
  }




  return slug;
}




// ======================
// FULL SLUG CREATOR
// ======================

export function createSlug({

  text = "",
  items = [],
  currentId = null,

}) {

  const baseSlug =
    generateSlug(text);




  return getUniqueSlug(
    baseSlug,
    items,
    currentId
  );

}