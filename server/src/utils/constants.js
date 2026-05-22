
const LEAD_SOURCE = Object.freeze({
  CALL:      'call',
  WHATSAPP:  'whatsapp',
  FIELD:     'field',
});

const LEAD_STATUS = Object.freeze({
  NEW:           'new',
  INTERESTED:    'interested',
  NOT_INTERESTED: 'not_interested',
  CONVERTED:     'converted',
});

const HTTP = Object.freeze({
  OK:         200,
  CREATED:    201,
  NO_CONTENT: 204,
  BAD_REQUEST:  400,
  NOT_FOUND:    404,
  CONFLICT:     409,
  UNPROCESSABLE: 422,
  INTERNAL:     500,
});

const PAGINATION = Object.freeze({
  DEFAULT_PAGE:  1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT:     100,
});

module.exports = { LEAD_SOURCE, LEAD_STATUS, HTTP, PAGINATION };