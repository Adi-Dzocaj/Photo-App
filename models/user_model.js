module.exports = bookshelf => {
    return bookshelf.model(
        'User',
        {
            tableName: 'Users',
            photos() {
                return this.hasMany('Photo');
            },
            albums() {
                return this.hasMany('Album');
            },
        },
        {
            async fetchById(id, fetchOptions = {}) {
                return await new this({ id }).fetch(fetchOptions);
            },
        }
    );
};