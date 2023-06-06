import type { User } from '@/types/User.interface'
import { useResourceAPI } from './useResourceAPI'

export const useUserAPI = () => {
  // Get simple sync functionalities
  const { syncResource, desyncResource, syncAllResources, getResourceDocRef } =
    useResourceAPI<User>('users', (uid, userData) => ({
      uid: uid,
      name: userData.name,
      email: userData.email,
      createdAt: new Date(userData.createdAt),
      about: userData.about,
      admin: userData.admin,
      color: userData.color
    }))

  return {
    syncUser: syncResource,
    desyncUser: desyncResource,
    syncAllUsers: syncAllResources,
    getUserDocRef: getResourceDocRef
  }
}
