export interface User extends UserDatabase {
  uid: string
}

export interface UserDatabase {
  name: string
  email: string

  createdAt: Date

  color?: string
  about?: string
  admin?: boolean
}
