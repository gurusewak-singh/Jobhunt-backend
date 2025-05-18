// controllers/profileController.js
export const getProfileCompletion = async (req, res) => {
  const { type } = req.query;
  const userId = req.user._id;

  if (type === 'candidate') {
    // Fetch user data and calculate completion
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const totalFields = 5;
    const filledFields = ['name', 'email', 'bio', 'skills', 'resume'].filter(
      (field) => !!user[field]
    );

    const percentage = (filledFields.length / totalFields) * 100;
    return res.status(200).json({ percentage });
  }

  return res.status(400).json({ message: 'Invalid type' });
};
