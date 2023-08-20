import type { ComputedRef } from 'vue'
import { computed } from 'vue'

const PARTNER_TAG = 'codingfeline-22'

export function createProductUrl(asin: string): string {
  return `https://www.amazon.co.jp/dp/product/${asin}/?tag=${PARTNER_TAG}`
}

export function createProductsUrl(asins: string): string {
  return `https://www.amazon.co.jp/dp/products/${asins}/?tag=${PARTNER_TAG}`
}

export function createImageUrl(asin: string): string {
  return `//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=${asin}&Format=_SL160_&ID=AsinImage&MarketPlace=JP&ServiceVersion=20070822&WS=1&tag=${PARTNER_TAG}&language=ja_JP`
}

export function useAmazonLink(asin: string): {
  productUrl: ComputedRef<string>
  imageUrl: ComputedRef<string>
} {
  const productUrl = computed(() => createProductUrl(asin))
  const imageUrl = computed(() => createImageUrl(asin))

  return {
    productUrl,
    imageUrl,
  }
}
