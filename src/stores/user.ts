import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/types/User.interface'
import { auth, db } from '@/api/firebase'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)

  // Keep logged user synced
  auth.onAuthStateChanged(async (newUser) => {
    if (newUser == null) {
      user.value = null
      return
    }

    // Get the user's database data
    const docRef = doc(db, 'users', newUser.uid)
    const userData = await getDoc(docRef).then(document => document.data())

    console.log('User data:', userData)

    user.value = {
      nickname: newUser.displayName ?? 'user',
      email: newUser.email ?? '',
      uid: newUser.uid,
      about: userData?.about,
      admin: userData?.admin
    }
  })

  return { user }
})
