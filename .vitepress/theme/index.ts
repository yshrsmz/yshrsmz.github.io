import type { Theme } from 'vitepress'
import VPLayout from './VPLayout.vue'
import VPKindleDetail from './components/VPKindleDetail.vue'
import VPKindleDetailList from './components/VPKindleDetailList.vue'
import './style.css'

export default {
  Layout: VPLayout,
  enhanceApp({ app, router: _router, siteData: _siteData }) {
    app.component('VPKindleDetail', VPKindleDetail)
    app.component('VPKindleDetailList', VPKindleDetailList)
  },
} satisfies Theme
