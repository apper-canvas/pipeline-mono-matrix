import contactsData from '../mockData/contacts.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let contacts = [...contactsData]

const contactService = {
  async getAll() {
    await delay(300)
    return [...contacts]
  },

  async getById(id) {
    await delay(200)
    const contact = contacts.find(c => c.id === id)
    if (!contact) {
      throw new Error('Contact not found')
    }
    return { ...contact }
  },

  async create(contactData) {
    await delay(400)
    const newContact = {
      id: Date.now().toString(),
      ...contactData,
      lastContact: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      tags: contactData.tags || []
    }
    contacts.unshift(newContact)
    return { ...newContact }
  },

  async update(id, updateData) {
    await delay(350)
    const index = contacts.findIndex(c => c.id === id)
    if (index === -1) {
      throw new Error('Contact not found')
    }
    contacts[index] = { ...contacts[index], ...updateData }
    return { ...contacts[index] }
  },

  async delete(id) {
    await delay(250)
    const index = contacts.findIndex(c => c.id === id)
    if (index === -1) {
      throw new Error('Contact not found')
    }
    contacts.splice(index, 1)
    return true
  }
}

export default contactService