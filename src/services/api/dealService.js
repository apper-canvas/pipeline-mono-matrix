import dealsData from '../mockData/deals.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let deals = [...dealsData]

const dealService = {
  async getAll() {
    await delay(350)
    return [...deals]
  },

  async getById(id) {
    await delay(200)
    const deal = deals.find(d => d.id === id)
    if (!deal) {
      throw new Error('Deal not found')
    }
    return { ...deal }
  },

  async create(dealData) {
    await delay(400)
    const newDeal = {
      id: Date.now().toString(),
      ...dealData,
      createdAt: new Date().toISOString()
    }
    deals.unshift(newDeal)
    return { ...newDeal }
  },

  async update(id, updateData) {
    await delay(300)
    const index = deals.findIndex(d => d.id === id)
    if (index === -1) {
      throw new Error('Deal not found')
    }
    deals[index] = { ...deals[index], ...updateData }
    return { ...deals[index] }
  },

  async delete(id) {
    await delay(250)
    const index = deals.findIndex(d => d.id === id)
    if (index === -1) {
      throw new Error('Deal not found')
    }
    deals.splice(index, 1)
    return true
  }
}

export default dealService