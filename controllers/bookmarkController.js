import Bookmark from '../models/bookmark.js';

export const bookmarkJob = async (req, res) => {
  try {
    const { jobId } = req.body;

    const bookmark = await Bookmark.create({
      user: req.user.id,
      job: jobId,
    });

    res.status(201).json({ message: 'Job bookmarked.', bookmark });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeBookmark = async (req, res) => {
  try {
    await Bookmark.findOneAndDelete({ user: req.user.id, job: req.params.jobId });

    res.status(200).json({ message: 'Bookmark removed.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user.id })
      .populate('job', 'title company location')
      .sort({ createdAt: -1 });

    res.status(200).json(bookmarks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
