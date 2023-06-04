export interface User {
  name: string
  uid: string
  email: string

  createdAt: Date

  about?: string
  admin?: boolean
}
