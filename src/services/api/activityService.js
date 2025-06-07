import activitiesData from '../mockData/activities.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let activities = [...activitiesData]

const activityService = {
  async getAll() {
    await delay(280)
    return [...activities]
  },

  async getById(id) {
    await delay(200)
    const activity = activities.find(a => a.id === id)
    if (!activity) {
      throw new Error('Activity not found')
    }
    return { ...activity }
  },

  async create(activityData) {
    await delay(350)
    const newActivity = {
      id: Date.now().toString(),
      ...activityData,
      date: activityData.date || new Date().toISOString().split('T')[0]
    }
    activities.unshift(newActivity)
    return { ...newActivity }
  },

  async update(id, updateData) {
    await delay(300)
    const index = activities.findIndex(a => a.id === id)
    if (index === -1) {
      throw new Error('Activity not found')
    }
    activities[index] = { ...activities[index], ...updateData }
    return { ...activities[index] }
  },

  async delete(id) {
    await delay(250)
    const index = activities.findIndex(a => a.id === id)
    if (index === -1) {
      throw new Error('Activity not found')
    }
    activities.splice(index, 1)
    return true
  }
}

export default activityService