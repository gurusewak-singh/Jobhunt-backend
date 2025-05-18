import Message from '../models/message.js';

export const createMessage = async (req, res) => {
  try {
    // Ensure the request has required fields
    if (!req.body.recipient || !req.body.content) {
      return res.status(400).json({ message: 'Recipient and content are required.' });
    }

    const message = await Message.create({
      sender: req.user.id, // Sender is the logged-in user
      receiver: req.body.recipient, // Make sure 'receiver' is the correct field in the schema
      content: req.body.content,
    });

    res.status(201).json({ message: 'Message created successfully.', message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ receiver: req.user.id })
      .populate('sender', 'name email');  // Populate sender data for UX

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMessageById = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id)
      .populate('sender', 'name email');

    if (!message) return res.status(404).json({ message: 'Message not found.' });

    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) return res.status(404).json({ message: 'Message not found.' });

    if (message.receiver.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own messages.' });
    }

    await message.remove();

    res.status(200).json({ message: 'Message deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
