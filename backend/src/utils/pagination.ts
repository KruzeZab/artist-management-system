/**
 * Return pagination information
 *
 */
export const buildMeta = (
  page: number,
  limit: number,
  totalRecords: number,
  totalPages: number,
) => ({
  currentPage: page,
  perPage: limit,
  totalRecords,
  totalPages,
});
