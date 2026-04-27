<?php
/**
 * Trims the WooCommerce REST `GET /wp-json/wc/v3/products` (collection) response to
 * a fixed allowlist of keys. Pair with the Next app’s `WOO_PRODUCT_LIST_REST_FIELDS_CSV`
 * in `lib/woo-product-list-fields.ts` and keep the lists in sync.
 *
 * Copy into `functions.php` (or a small mu-plugin) and require this file, or paste the
 * `brandsplace_wc_is_product_collection_request` + `brandsplace_wc_prune_list_product` parts.
 *
 * Skips when:
 * - request is not the product collection route, or
 * - `brandsplace_list_full=1` is present (return full product objects, e.g. “resolve by slug”).
 *
 * Your Finale / price filter can stay at priority 20; this runs at 30 so it prunes
 * *after* you patch `price`, `regular_price`, and `sale_price`.
 */

if ( ! function_exists( 'brandsplace_wc_is_product_collection_request' ) ) {
	/**
	 * @param WP_REST_Request $request Request.
	 */
	function brandsplace_wc_is_product_collection_request( $request ) {
		$route = (string) $request->get_route();
		// List: /wc/v3/products — not /wc/v3/products/123
		return (bool) preg_match( '#^/wc/v[0-9]+/products$#', $route );
	}
}

if ( ! function_exists( 'brandsplace_wc_list_product_allowed_keys' ) ) {
	/**
	 * Top-level keys to keep for list responses. Sync with `WOO_PRODUCT_LIST_REST_FIELDS` in
	 * `lib/woo-product-list-fields.ts`.
	 *
	 * @return string[]
	 */
	function brandsplace_wc_list_product_allowed_keys() {
		return array(
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
		);
	}
}

if ( ! function_exists( 'brandsplace_wc_prune_list_product' ) ) {
	/**
	 * @param WP_REST_Response $response Response.
	 * @param WC_Product      $object   Product object.
	 * @param WP_REST_Request $request  Request.
	 */
	function brandsplace_wc_prune_list_product( $response, $object, $request ) {
		if ( ! brandsplace_wc_is_product_collection_request( $request ) ) {
			return $response;
		}
		if ( $request->get_param( 'brandsplace_list_full' ) ) {
			return $response;
		}
		$fields = $request->get_param( '_fields' );
		// If the request did not ask to limit fields, return the full product (e.g. Next
		// `getProductBySlug` uses the collection URL without `?_fields=` for a full object).
		if ( null === $fields || '' === $fields ) {
			return $response;
		}
		// Client may already pass WordPress `?_fields=`; this is a redundant safety net.
		$allowed = array_flip( brandsplace_wc_list_product_allowed_keys() );
		$data    = $response->get_data();
		$data    = array_intersect_key( $data, $allowed );
		$response->set_data( $data );
		return $response;
	}
}

add_filter( 'woocommerce_rest_prepare_product_object', 'brandsplace_wc_prune_list_product', 30, 3 );
