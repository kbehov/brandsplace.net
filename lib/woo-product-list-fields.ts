/**
 * Comma-separated `_fields` for `GET /wc/v3/products` (WordPress global REST param).
 * Prunes the JSON: drops heavy keys like `meta_data`, `description`, `default_attributes`, etc.
 *
 * Keep in sync with `snippets/woocommerce-optimize-list-response.php` in this repo
 * (PHP allowlist) if you prune server-side too.
 */
export const WOO_PRODUCT_LIST_REST_FIELDS = [
  'id',
  'name',
  'slug',
  'permalink',
  'type',
  'status',
  'featured',
  'on_sale',
  'purchasable',
  'price',
  'regular_price',
  'sale_price',
  'price_html',
  'images',
  'stock_status',
  'average_rating',
  'rating_count',
  'categories',
  'variations',
  'date_created',
  'attributes',
] as const

export const WOO_PRODUCT_LIST_REST_FIELDS_CSV: string = WOO_PRODUCT_LIST_REST_FIELDS.join(',')
