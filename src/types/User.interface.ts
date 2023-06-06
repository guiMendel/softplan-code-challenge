export interface User extends UserDatabase {
  uid: string
}

export interface UserDatabase {
  // Account details
  name: string
  email: string
  createdAt: Date
  admin?: boolean

  // Customization
  color?: string
  about?: string
}
