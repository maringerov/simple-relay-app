// Model types
export class User extends Object {}
export class Contact extends Object {}

// Mock authenticated user
const VIEWER_ID = 'me';

// Mock data
var viewer = new User();
viewer.id = VIEWER_ID;
var usersById = {
  [VIEWER_ID]: viewer
};

// Mock contacts data
var contactsById = {};
var contactIdsByUser = {
  [VIEWER_ID]: []
};
var nextContactId = 0;

// Add some secret agents
addContact('James Bond');
addContact('Ethan Hunt');
addContact('Jason Bourne');
addContact('Marin G');

export function addContact(name) {
  var contact = new Contact();
  contact.name = name;
  contact.id = `${nextContactId++}`;
  contactsById[contact.id] = contact;
  contactIdsByUser[VIEWER_ID].push(contact.id);
  return contact.id;
}

export function getContact(id) {
  return contactsById[id];
}

export function getContacts() {
  return contactIdsByUser[VIEWER_ID].map((id) => contactsById[id]);
}

export function getUser(id) {
  return usersById[VIEWER_ID];
}

export function getViewer() {
  return getUser(VIEWER_ID);
}
