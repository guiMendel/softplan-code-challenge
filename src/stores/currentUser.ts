import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { User, UserDatabase } from '@/types/User.interface'
import { auth } from '@/api/firebase'
import { setDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateEmail,
  updatePassword,
  updateProfile
} from 'firebase/auth'
import { useUserAPI } from '@/modules/useUserAPI'
import type { UploadableEntry } from '@/modules/useResourceAPI'

export const useCurrentUserStore = defineStore('currentUser', () => {
  // Consume user api module
  const { syncUser, desyncUser, getUserDocRef } = useUserAPI()

  // The current user instance
  const currentUser = ref<User | null>(null)

  // Keep logged user synced
  auth.onAuthStateChanged(async (newUser) => {
    // Reset user
    if (newUser == null) {
      desyncUser()
      currentUser.value = null
    }

    // Sync to new user
    else syncUser(newUser.uid, currentUser)
  })

  // Log in to a user
  const login = async (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password)

  // Create a new user
  const signup = async (email: string, password: string, name: string) =>
    // Create the user
    createUserWithEmailAndPassword(auth, email, password).then(async ({ user }) => {
      // Set its name
      await updateProfile(user, { displayName: name })

      const date = new Date().toJSON()

      // Set its database entry
      await setDoc(getUserDocRef(user.uid), { name, email, createdAt: date, modifiedAt: date })

      return user
    })

  // Update the current user
  const updateCurrentUser = async (newData: Partial<User> & { password?: string }) => {
    if (auth.currentUser == null) return

    // Handle email change
    if (newData.email != undefined) await updateEmail(auth.currentUser, newData.email)

    // Handle password change
    if (newData.password != undefined) await updatePassword(auth.currentUser, newData.password)

    // Handle name change
    if (newData.name != undefined)
      await updateProfile(auth.currentUser, { displayName: newData.name })

    // Set database data
    const databaseData: UploadableEntry<UserDatabase> = { modifiedAt: new Date().toJSON() }

    if (newData.name != undefined) databaseData.name = newData.name
    if (newData.about != undefined) databaseData.about = newData.about
    if (newData.admin != undefined) databaseData.admin = newData.admin
    if (newData.email != undefined) databaseData.email = newData.email
    if (newData.color != undefined) databaseData.color = newData.color

    await updateDoc(getUserDocRef(auth.currentUser.uid), databaseData)
  }

  const deleteUser = async () => {
    if (auth.currentUser == null) return

    // Delete database entry
    await deleteDoc(getUserDocRef(auth.currentUser.uid))

    return auth.currentUser.delete()
  }

  return { currentUser, login, signup, updateCurrentUser, deleteUser }
})
