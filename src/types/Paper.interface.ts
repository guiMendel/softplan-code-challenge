export interface Paper extends PaperDatabase {
  uid: string
}

export interface PaperDatabase {
  // Entry details
  ownerUid: string
  createdAt: Date
  modifiedAt: Date

  // Paper data
  title: string
  content: string
}
