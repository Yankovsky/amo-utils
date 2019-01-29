const fetch = require('isomorphic-unfetch')
const querystring = require('querystring');

module.exports = (baseUrl, userLogin, userHash) => {
	const authQueryParams = {
		USER_LOGIN: userLogin,
		USER_HASH: userHash,
	}

	const getAmoApiUrl = (apiPath, query) =>
		`${baseUrl}${apiPath}?${querystring.stringify({...authQueryParams, ...query})}`

	const getAmoItems = (getRequestUrl, requestedItemsCount) => {
		const getItemsAcc = (offset, itemsAcc) =>
			fetch(getRequestUrl(offset), {
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
					return itemsAcc
				}

				const items = result._embedded.items
				if (items.length < requestedItemsCount) {
					return itemsAcc.concat(items)
				}

				return getItemsAcc(offset + requestedItemsCount, itemsAcc.concat(items))
			})

		return getItemsAcc(0, [])
	}

	return {
		// TODO > timestamp на вход
		// Контакты отдаются по 500, поэтому нам надо вызывать этот запрос с правильным offset пока не загрузим все контакты
		getContacts: () => {
			const REQUESTED_CONTACTS_COUNT = 500

			const getContactsRequestUrl = offset => getAmoApiUrl('/api/v2/contacts/', {
				limit_rows: REQUESTED_CONTACTS_COUNT,
				limit_offset: offset
			})

			return getAmoItems(getContactsRequestUrl, REQUESTED_CONTACTS_COUNT)
		},
		// Контакты отдаются по 500, поэтому нам надо вызывать этот запрос с правильным offset пока не загрузим все контакты
		getLeads: () => {
			const REQUESTED_LEADS_COUNT = 500

			const getLeadsRequestUrl = offset => getAmoApiUrl('/api/v2/leads/', {
				limit_rows: REQUESTED_LEADS_COUNT,
				limit_offset: offset
			})

			return getAmoItems(getLeadsRequestUrl, REQUESTED_LEADS_COUNT)
		},
	}
}
