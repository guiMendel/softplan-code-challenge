import { onBeforeUnmount, ref, type Ref } from 'vue'
import type { User } from '@/types/User.interface'
import { db } from '@/api/firebase'
import {
  collection,
  doc,
  type DocumentData,
  DocumentSnapshot,
  QueryDocumentSnapshot,
  onSnapshot
} from 'firebase/firestore'

export const useUserAPI = () => {
  // Unsubscribe callbacks
  const unsubscribe = {
    users: () => {},
    user: () => {}
  }

  // Extract a user from a db user doc
  const extractUser = (
    doc: DocumentSnapshot<DocumentData> | QueryDocumentSnapshot<DocumentData>
  ) => {
    const user = doc.data()

    if (user == undefined) return null

    return {
      uid: doc.id,
      name: user.name,
      email: user.email,
      createdAt: new Date(user.createdAt),
      about: user.about,
      admin: user.admin,
      color: user.color
    }
  }

  // Get reference to a user's doc
  const getUserDocRef = (uid: string) => doc(db, 'users', uid)

  // Unsubscribe last synced user
  const desyncUser = () => {
    unsubscribe.user()
    unsubscribe.user = () => {}
  }

  // Get a user
  const syncUser = (uid: string, useUser?: Ref<User | null>): Ref<User | null> => {
    // Reuse user if provided
    const user = useUser ?? ref<User | null>(null)

    // Disable last call
    unsubscribe.user()

    // Listen for changes to user
    unsubscribe.user = onSnapshot(
      getUserDocRef(uid),
      (snapshot) => (user.value = extractUser(snapshot))
    )

    return user
  }

  // Get all users
  const syncAllUsers = (): Ref<User[]> => {
    const users = ref<User[]>([])

    // Disable last call
    unsubscribe.users()

    // Listen for changes to users
    unsubscribe.users = onSnapshot(
      collection(db, 'users'),
      // Map in a user fo each doc
      (snapshot) => (users.value = snapshot.docs.map(extractUser) as User[])
    )

    return users
  }

  // ==================
  // === CLEAN UP
  // ==================

  // Perform unsubscriptions
  onBeforeUnmount(() => {
    unsubscribe.users()
    unsubscribe.user()
  })

  return { syncUser, desyncUser, syncAllUsers, getUserDocRef }
}
