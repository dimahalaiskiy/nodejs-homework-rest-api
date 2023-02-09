const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");

const contactsPath = path.join(__dirname, "./contacts.json");

const updateContacts = async (contacts) => {
  await fs.writeFile(contactsPath, JSON.stringify(contacts));
};

const listContacts = async () => {
  const data = await fs.readFile(contactsPath);
  return JSON.parse(data);
};

const getContactById = async (contactId) => {
  const contacts = await listContacts();
  const contact = contacts.find((contact) => contact.id === contactId.toString());
  return contact;
};

const updateContact = async (contactId, body) => {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId.toString());
  if (index === -1) {
    return null;
  }
  const updatedContacts = contacts.map((contact, idx) => {
    if (index === idx) {
      return { ...contact, ...body };
    }
    return contact;
  });
  await updateContacts(updatedContacts);
  return contacts[index];
};

const removeContact = async (contactId) => {
  const contacts = await listContacts();
  let removedContact = null;
  const filteredContacts = contacts.filter((contact) => {
    if (contact.id === contactId.toString()) {
      removedContact = contact;
    }
    return contact.id !== contactId.toString();
  });
  if (!filteredContacts.length) {
    return null;
  }
  await updateContacts(filteredContacts);
  return removedContact;
};

const addContact = async (body) => {
  const contacts = await listContacts();
  const contact = {
    id: nanoid(),
    ...body,
  };
  contacts.push(contact);
  await updateContacts(contacts);
  return contact;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
