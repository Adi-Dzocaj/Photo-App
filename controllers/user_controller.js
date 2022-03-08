// READ - GET USER
const index = async (req, res) => {

	res.send({
		status: 'successful',
		data: {
			user: req.user
		}
	});
}

module.exports = {
    index,
}