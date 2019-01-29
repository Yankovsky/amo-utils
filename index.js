const fetch = require('isomorphic-unfetch')

module.exports = (baseUrl, userLogin, userHash) => {
	return {
		// TODO > timestamp на вход
		// Контакты отдаются по 500, поэтому нам надо вызывать этот запрос с правильным offset
		// пока не загрузим все контакты
		getContacts: () => {
			const AUTH_QUERY_PARAMS = `USER_LOGIN=${userLogin}&USER_HASH=${userHash}`
			const REQUESTED_CONTACTS_COUNT = 500

			const getContactsRequestUrl = offset =>
				`${baseUrl}/api/v2/contacts/?limit_rows=${REQUESTED_CONTACTS_COUNT}&limit_offset=${offset}&${AUTH_QUERY_PARAMS}`

			const getContactsAcc = (offset, contacts) =>
				fetch(getContactsRequestUrl(offset), {
					method: 'GET',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
					},
				}).then(response => {
					const status = response.status
					if (status === 204) {
						return null
					}
					if (status === 200) {
						return response.json()
					}
					return response.text().then(error => {
						console.error(status, error)
						return null
					}).catch(error => {
						console.error(error)
						return null
					})
				}).then(result => {
					if (!result) {
						return contacts
					}

					const items = result._embedded.items
					if (items.length < REQUESTED_CONTACTS_COUNT) {
						return contacts.concat(items)
					}

					return getContactsAcc(offset + REQUESTED_CONTACTS_COUNT, contacts.concat(items))
				})

			return getContactsAcc(0, [])
		},
	}
}
