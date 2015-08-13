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
var contact1 = {
  name: 'James Bond',
  email: 'james.bond@mi5.co.uk',
  phone: '+1 555 666 333',
  notes: 'Britain\s top secretagent'
};
var contact2 = {
  name: 'Jason Bourne',
  email: 'jason@cia.com',
  phone: '+1 234 567 897',
  notes: 'Met him during a holiday in Greece'
};
var contact3 = {
  name: 'Ethan Hunt',
  email: 'ethanhunt@agent.co',
  phone: '+1 000 111 222',
  notes: 'Like to hang from buildings'
};
addContact(contact1);
addContact(contact2);
addContact(contact3);

export function addContact(name, email, phone, notes) {
  var contact = new Contact();
  contact.name = name;
  contact.email = email;
  contact.phone = phone;
  contact.notes = notes;
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

export function updateContact(id, name, email, phone, notes) {
  var contact = getContact(id);
  contact.name = name;
  contact.email = email;
  contact.phone = phone;
  contact.notes = notes;
}
