module.exports = (sequelize, DataTypes) => {
    const Posts = sequelize.define('Posts', {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        postText: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    })

    Posts.associate = (models) => {
        Posts.hasMany(models.Comments, {
            onDelete: 'cascade',
        }) 
        Posts.hasMany(models.Likes, {
            onDelete: 'cascade',
        })
        Posts.belongsTo(models.Users, {
            onDelete: 'cascade',
        })
    }
    
    return Posts
}