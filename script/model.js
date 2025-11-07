class Model {
  store = new Store()

  getIds(cursor, count, resource) {
    if (resource instanceof Resource) {
      return Client.fetchIds(resource.url).then((ids) => ids.slice(cursor, cursor + count))
    } else if (typeof resource === 'number') {
      return this.store.find(resource).then((item) => item.kids.slice(cursor, cursor + count))
    } else {
      return this.unit(this.unit([]))
    }
  }

  getItems({ cursor, count, resource }) {
    return this.getIds(cursor, count, resource)
      .then(this.store.retrieve.bind(this.store))
      .then(this.getMissingItems.bind(this))
      .catch((error) => console.error(error))
  }

  getMissingItems({ foundItems, missingIds }) {
    return new Promise((resolve, reject) => {
      if (!missingIds.length) {
        return foundItems.length ? resolve(foundItems) : reject({ foundItems, missingIds })
      }

      return Client.fetchItems(missingIds).then((items) => {
        if (!items?.length) {
          return reject(items)
        }

        return this.store.saveAll(items).then(() => {
          return resolve(items.concat(foundItems))
        })
      })
    })
  }

  unit(result) {
    return new Promise((resolve) => resolve(result))
  }
}
