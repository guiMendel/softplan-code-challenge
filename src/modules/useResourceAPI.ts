import { db } from '@/api/firebase'
import {
  doc,
  onSnapshot,
  type DocumentData,
  type DocumentSnapshot,
  type QueryDocumentSnapshot,
  collection
} from 'firebase/firestore'
import { onBeforeUnmount, ref, type Ref } from 'vue'

// Allows for syncing to resources in firestore
export const useResourceAPI = <Resource>(
  resourceCollection: string,
  extractResource: (resourceUid: string, resourceData: DocumentData) => Resource
) => {
  // Unsubscribe callbacks
  const unsubscribe = {
    resources: () => {},
    resource: () => {}
  }

  // Extract a resource from a db resource doc
  const snapshotToResource = (
    doc: DocumentSnapshot<DocumentData> | QueryDocumentSnapshot<DocumentData>
  ): Resource | null => {
    const resourceData = doc.data()

    if (resourceData == undefined) return null

    return extractResource(doc.id, resourceData)
  }

  // Get reference to a resource's doc
  const getResourceDocRef = (uid: string) => doc(db, resourceCollection, uid)

  // Unsubscribe last synced resource
  const desyncResource = () => {
    unsubscribe.resource()
    unsubscribe.resource = () => {}
  }

  // Get a resource
  const syncResource = (uid: string, useResource?: Ref<Resource | null>): Ref<Resource | null> => {
    // Reuse resource if provided
    const resource = useResource ?? (ref<Resource | null>(null) as Ref<Resource | null>)

    console.log(uid, useResource?.value, getResourceDocRef(uid))

    // Disable last call
    unsubscribe.resource()

    // Listen for changes to resource
    unsubscribe.resource = onSnapshot(
      getResourceDocRef(uid),
      (snapshot) => (resource.value = snapshotToResource(snapshot))
    )

    return resource
  }

  // Get all resources
  const syncAllResources = (): Ref<Resource[]> => {
    const resources = ref<Resource[]>([]) as Ref<Resource[]>

    // Disable last call
    unsubscribe.resources()

    // Listen for changes to resources
    unsubscribe.resources = onSnapshot(
      collection(db, resourceCollection),
      // Map in a resource fo each doc
      (snapshot) => (resources.value = snapshot.docs.map(snapshotToResource) as Resource[])
    )

    return resources
  }

  // ==================
  // === CLEAN UP
  // ==================

  // Perform unsubscriptions
  onBeforeUnmount(() => {
    unsubscribe.resources()
    unsubscribe.resource()
  })

  return { syncResource, desyncResource, syncAllResources, getResourceDocRef }
}
