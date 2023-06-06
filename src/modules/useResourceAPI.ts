import { db } from '@/api/firebase'
import {
  doc,
  onSnapshot,
  type DocumentData,
  type DocumentSnapshot,
  type QueryDocumentSnapshot,
  collection,
  query,
  CollectionReference
} from 'firebase/firestore'
import { onBeforeUnmount, ref, type Ref } from 'vue'

export type UploadableEntry<Resource> = Omit<Omit<Partial<Resource>, 'createdAt'>, 'modifiedAt'> & {
  modifiedAt: string
}

export type UploadableEntryComplete<Resource> = Omit<Omit<Resource, 'createdAt'>, 'modifiedAt'> & {
  modifiedAt: string
  createdAt: string
}

// Allows for syncing to resources in firestore
export const useResourceAPI = <Resource>(
  resourceCollection: string,
  extractResource: (resourceUid: string, resourceData: DocumentData) => Resource
) => {
  const resourceCollectionInstance = collection(db, resourceCollection)

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

    // Disable last call
    unsubscribe.resource()

    // Listen for changes to resource
    unsubscribe.resource = onSnapshot(
      getResourceDocRef(uid),
      (snapshot) => (resource.value = snapshotToResource(snapshot))
    )

    return resource
  }

  // Allows for setting a query builder for the syncListResources method
  const getListQuery = ref((collection: CollectionReference<DocumentData>) => query(collection))

  // Get all resources
  const syncListResources = (): Ref<Resource[]> => {
    const resources = ref<Resource[]>([]) as Ref<Resource[]>

    // Disable last call
    unsubscribe.resources()

    // Listen for changes to resources
    unsubscribe.resources = onSnapshot(
      getListQuery.value(resourceCollectionInstance),
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

  return {
    syncResource,
    desyncResource,
    syncListResources,
    getResourceDocRef,
    getListQuery,
    resourceCollection: resourceCollectionInstance
  }
}
