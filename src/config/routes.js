import Dashboard from '../pages/Dashboard'
import Contacts from '../pages/Contacts' 
import Deals from '../pages/Deals'
import Activities from '../pages/Activities'

export const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'BarChart3',
    component: Dashboard,
    path: '/dashboard'
  },
  contacts: {
    id: 'contacts', 
    label: 'Contacts',
    icon: 'Users',
    component: Contacts,
    path: '/contacts'
  },
  deals: {
    id: 'deals',
    label: 'Deals', 
    icon: 'Target',
    component: Deals,
    path: '/deals'
  },
  activities: {
    id: 'activities',
    label: 'Activities',
    icon: 'Activity',
    component: Activities,
    path: '/activities'
  }
}

export const routeArray = Object.values(routes)