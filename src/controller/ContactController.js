const { CreateContactValidation } = require('../validations/contacts');
const expressAsyncHandler = require('express-async-handler');
const Contact = require('../models/Contact')

const getContacts = expressAsyncHandler(async (req, res) => {
  const contacts = await Contact.find()
  res.status(200).json(contacts)
})

const createContact = expressAsyncHandler(async (req, res) => {
  console.log("req.body", req.body)
  const { error, value } = CreateContactValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message);

  const { phone } = value
  const userAlreadyExist = await Contact.findOne({ phone })
  if (userAlreadyExist) return res.status(400).send('User already exist')

  const contact = new Contact(value)
  const savedContact = await contact.save()
  res.status(201).json(savedContact)
})

const getContact = expressAsyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id)
  if (!contact) {
    res.status(400).send('contact not found')
    throw new Error('Contact not found')
  }

  res.status(200).json(contact)
})

const updateContact = expressAsyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id)
  if (!contact) {
    res.status(400).send('contact not found')
    throw new Error('Contact not found')
  }

  const updatedContact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.status(200).json(updatedContact)
})

const deleteContact = expressAsyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id)
  if (!contact) {
    res.status(400).send('contact not found')
    throw new Error('Contact not found')
  }

  await Contact.deleteOne({ _id: req.params.id })
  res.status(200).json({ message: 'contact deleted' })
})




module.exports = { getContacts, createContact, updateContact, getContact, deleteContact }