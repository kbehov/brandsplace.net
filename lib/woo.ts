import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api'

const woo = new WooCommerceRestApi({
  url: process.env.WOOCOMMERCE_URL || '',
  consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY || '',
  consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET || '',
  version: 'wc/v3',
  queryStringAuth: true,
  timeout: 30000,
})

export default woo
