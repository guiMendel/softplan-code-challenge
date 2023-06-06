import type { User } from '@/types/User.interface'
import { useResourceAPI } from './useResourceAPI'

export const useUserAPI = () => {
  // Get simple sync functionalities
  const { syncResource, desyncResource, syncListResources, getResourceDocRef } =
    useResourceAPI<User>('users', (uid, userData) => ({
      uid: uid,
      name: userData.name,
      email: userData.email,
      createdAt: new Date(userData.createdAt),
      modifiedAt: new Date(userData.modifiedAt),
      about: userData.about,
      admin: userData.admin,
      color: userData.color
    }))

  return {
    syncUser: syncResource,
    desyncUser: desyncResource,
    syncListUsers: syncListResources,
    getUserDocRef: getResourceDocRef
  }
}
