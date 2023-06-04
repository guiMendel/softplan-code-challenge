import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/types/User.interface'
import { auth, db } from '@/api/firebase'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateEmail,
  updatePassword,
  updateProfile
} from 'firebase/auth'

export const useUserStore = defineStore('user', () => {
  // ==================
  // === GENERAL USERS
  // ==================

  // Get a user
  const getUser = async (uid: string): Promise<User | null> => {
    // Get the user's database data
    const userData = await getDoc(getDocRef(uid)).then((document) => document.data())

    if (userData == null) return null

    console.log('User data:', userData)

    return {
      uid: uid,
      name: userData.name,
      email: userData.email,
      createdAt: new Date(userData.createdAt),
      about: userData.about,
      admin: userData.admin
    }
  }

  // ==================
  // === CURRENT USER
  // ==================

  // The user instance
  const currentUser = ref<User | null>(null)

  // Get reference to a user's doc
  const getDocRef = (uid: string) => doc(db, 'users', uid)

  // Keep logged user synced
  auth.onAuthStateChanged(async (newUser) => {
    if (newUser == null) {
      currentUser.value = null
      return
    }

    currentUser.value = await getUser(newUser.uid)
  })

  // Log in to a user
  const login = (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password)

  // Create a new user
  const signup = (email: string, password: string, name: string) =>
    // Create the user
    createUserWithEmailAndPassword(auth, email, password).then(({ user }) => {
      // Set its name
      updateProfile(user, { displayName: name })

      // Set its database entry
      setDoc(getDocRef(user.uid), { name, email, createdAt: new Date().toJSON() })

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
    await updateDoc(getDocRef(auth.currentUser.uid), { ...newData })

    // Update the local user data
    currentUser.value = await getUser(auth.currentUser.uid)
  }

  return { currentUser, login, signup, getUser, updateCurrentUser }
})
