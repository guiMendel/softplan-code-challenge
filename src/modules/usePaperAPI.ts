import type { Paper, PaperDatabase } from '@/types/Paper.interface'
import {
  useResourceAPI,
  type UploadableEntry,
  type UploadableEntryComplete
} from './useResourceAPI'
import { computed, watch, type Ref, watchEffect } from 'vue'
import { addDoc, collection, query, updateDoc, where } from 'firebase/firestore'
import { useCurrentUserStore } from '@/stores/currentUser'
import { storeToRefs } from 'pinia'

export const usePaperAPI = () => {
  // Get simple sync functionalities
  const {
    syncResource,
    desyncResource,
    syncListResources,
    getResourceDocRef,
    getListQuery,
    resourceCollection
  } = useResourceAPI<Paper>('papers', (uid, paperData) => ({
    uid: uid,
    ownerUid: paperData.ownerUid,
    title: paperData.title,
    content: paperData.content,
    createdAt: new Date(paperData.createdAt),
    modifiedAt: new Date(paperData.modifiedAt)
  }))

  // Consume current user store
  const { currentUser } = storeToRefs(useCurrentUserStore())

  // Sync list query to singed in user
  watchEffect(() => {
    if (currentUser.value == undefined) {
      getListQuery.value = (collection) => query(collection)
      return
    }

    getListQuery.value = (collection) =>
      query(collection, where('ownerUid', '==', currentUser.value?.uid))
  })

  // Allow editing a paper
  const syncPaper = (uid: string, usePaper?: Ref<Paper | null>) => {
    // Use inherited functionality
    const paper = syncResource(uid, usePaper)

    // Add editing capability
    return computed({
      get: () => paper.value,

      // Will update the synced paper's data. To sync to a different paper,
      // must call syncPaper again and provide the new paper's id
      set: (newPaper) => {
        console.log('Setting...')

        // Ignore setting to null or to an desynced paper
        if (newPaper == null || paper.value == null) return

        // Set database data
        const securedData: UploadableEntry<PaperDatabase> = { modifiedAt: new Date().toJSON() }

        if (newPaper.title != undefined) securedData.title = newPaper.title
        if (newPaper.content != undefined) securedData.content = newPaper.content
        if (newPaper.ownerUid != undefined) securedData.ownerUid = newPaper.ownerUid

        securedData.modifiedAt = new Date().toJSON()

        console.log('Updating paper to:', JSON.parse(JSON.stringify(securedData)))

        updateDoc(getResourceDocRef(paper.value.uid), securedData)
      }
    })
  }

  // Create a paper
  const createPaper = (title: string, initialContent = '') => {
    if (currentUser.value == null) throw new Error("Can't create while not logged in")

    const securedData: UploadableEntryComplete<PaperDatabase> = {
      createdAt: new Date().toJSON(),
      modifiedAt: new Date().toJSON(),
      title,
      content: initialContent,
      ownerUid: currentUser.value.uid
    }

    return addDoc(resourceCollection, securedData)
  }

  return {
    syncPaper,
    desyncPaper: desyncResource,
    syncListPapers: syncListResources,
    getPaperDocRef: getResourceDocRef,
    createPaper
  }
}
