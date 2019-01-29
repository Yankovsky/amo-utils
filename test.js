const AmoUtils = require('./index')

const { AMO_CRM_BASE_URL, AMO_CRM_USER_LOGIN, AMO_CRM_USER_HASH } = process.env

Promise.all([
	AmoUtils(AMO_CRM_BASE_URL, AMO_CRM_USER_LOGIN, AMO_CRM_USER_HASH).getContacts(),
	AmoUtils(AMO_CRM_BASE_URL, AMO_CRM_USER_LOGIN, AMO_CRM_USER_HASH).getLeads(),
]).then(([contacts, leads]) => {
	console.log('Contacts: ', contacts.length)
	console.log('Leads: ', leads.length)
})
