import type { Paper, PaperDatabase } from '@/types/Paper.interface'
import { useResourceAPI } from './useResourceAPI'
import { computed, type Ref } from 'vue'
import { updateDoc } from 'firebase/firestore'

export const usePaperAPI = () => {
  // Get simple sync functionalities
  const { syncResource, desyncResource, syncAllResources, getResourceDocRef } =
    useResourceAPI<Paper>('papers', (uid, paperData) => ({
      uid: uid,
      ownerUid: paperData.ownerUid,
      title: paperData.title,
      content: paperData.content,
      createdAt: new Date(paperData.createdAt)
    }))

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
        // Ignore setting to null or to an desynced paper
        if (newPaper == null || paper.value == null) return

        // Set database data
        const securedData: Omit<Partial<PaperDatabase>, 'createdAt'> = {}

        if (newPaper.title != undefined) securedData.title = newPaper.title
        if (newPaper.content != undefined) securedData.content = newPaper.content
        if (newPaper.ownerUid != undefined) securedData.ownerUid = newPaper.ownerUid

        updateDoc(getResourceDocRef(paper.value.uid), securedData)
      }
    })
  }

  return {
    syncPaper,
    desyncPaper: desyncResource,
    syncAllPapers: syncAllResources,
    getPaperDocRef: getResourceDocRef
  }
}
