module.exports = (bookshelf) => {
	return bookshelf.model('Photo', {
		tableName: 'Photos',
		users() {
			return this.belongsTo('User');
		},
		albums() {
			return this.belongsToMany('Album')
		}
	});
};