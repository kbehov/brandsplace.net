// WooCommerce order note (wc/v3/orders/{id}/notes)

export type WooOrderNote = {
  id: number
  author: string
  date_created: string
  date_created_gmt: string
  note: string
  customer_note: boolean
  added_by_user: boolean
  /** When present, identifies who created the note (WooCommerce may omit). */
  added_by?: string | null
}

export type WooOrderNoteListResponse = WooOrderNote[]

export type WooOrderNoteSingleResponse = WooOrderNote
