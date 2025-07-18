import type { Theme } from 'vitepress'
import VPAmazonGoods from './components/VPAmazonGoods.vue'
import VPKindleDetail from './components/VPKindleDetail.vue'
import VPKindleDetailList from './components/VPKindleDetailList.vue'
import VPKindleDetails from './components/VPKindleDetails.vue'
import VPLayout from './VPLayout.vue'
import './styles/vars.css'
import './styles/components/vp-code.css'
import './styles/components/vp-doc.css'
import './style.css'

export default {
  Layout: VPLayout,
  enhanceApp({ app, router: _router, siteData: _siteData }) {
    app.component('VPKindleDetail', VPKindleDetail)
    app.component('VPKindleDetailList', VPKindleDetailList)
    app.component('VPAmazonGoods', VPAmazonGoods)
    app.component('VPKindleDetails', VPKindleDetails)
  },
} satisfies Theme
