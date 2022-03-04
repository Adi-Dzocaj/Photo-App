module.exports = (bookshelf) => {
	return bookshelf.model('Album', {
		tableName: 'Albums',
		users() {
			return this.belongsTo('User');
		},
		photos() {
			return this.belongsToMany('Photos')
		}
	});
};