const getUserController = async (req, res) => {
  return res.json(req.userDetails);
};

module.exports.getUserController = getUserController;
