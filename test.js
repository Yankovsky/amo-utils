const AmoUtils = require('./index')

const { AMO_CRM_BASE_URL, AMO_CRM_USER_LOGIN, AMO_CRM_USER_HASH } = process.env

AmoUtils(AMO_CRM_BASE_URL, AMO_CRM_USER_LOGIN, AMO_CRM_USER_HASH).getAllContacts().then(c => console.log(c))
