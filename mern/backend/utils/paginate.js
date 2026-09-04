/**
 * Parses ?page= and ?limit= query params into safe values, and builds
 * a consistent pagination metadata object for list responses.
 *
 * Usage:
 *   const { page, limit, skip } = getPagination(req.query);
 *   const [items, totalItems] = await Promise.all([
 *     Model.find(filter).sort(...).skip(skip).limit(limit),
 *     Model.countDocuments(filter),
 *   ]);
 *   res.json({ success: true, data: items, pagination: buildPaginationMeta(page, limit, totalItems) });
 */

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

function getPagination(query = {}) {
  let page = parseInt(query.page, 10);
  let limit = parseInt(query.limit, 10);

  if (!Number.isInteger(page) || page < 1) page = 1;
  if (!Number.isInteger(limit) || limit < 1) limit = DEFAULT_LIMIT;
  if (limit > MAX_LIMIT) limit = MAX_LIMIT;

  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

function buildPaginationMeta(page, limit, totalItems) {
  const totalPages = Math.max(Math.ceil(totalItems / limit), 1);
  return {
    page,
    limit,
    totalItems,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}

module.exports = { getPagination, buildPaginationMeta, DEFAULT_LIMIT, MAX_LIMIT };
