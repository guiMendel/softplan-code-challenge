import './style/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

/* Fontawesome core, component */
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* Fontawesome icons */
import { faBackward, faPencil, faXmark, faPalette } from '@fortawesome/free-solid-svg-icons'

/* Add icons to the library */
library.add(faBackward, faPencil, faXmark, faPalette)

import App from './App.vue'
import router from './router'

const app = createApp(App)

// Add fontawesome component
app.component('font-awesome-icon', FontAwesomeIcon)

app.use(createPinia())
app.use(router)

app.mount('#app')
