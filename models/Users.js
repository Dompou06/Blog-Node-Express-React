module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define('Users', {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        presentation: {
            type: DataTypes.STRING,
            allowNull: true
        },
    })

    Users.associate = (models) => { 
        //Si ajout de la colonne ne fonctionne pas, supprimer tous les posts ou supprimer la table
        Users.hasMany(models.Posts, {
            onDelete: 'cascade',
        })
        Users.hasMany(models.Likes, {
            onDelete: 'cascade',
        })
        Users.hasMany(models.Suspends, {
            onDelete: 'cascade',
        })
        Users.hasMany(models.Comments, {
            onDelete: 'cascade',
        })
        Users.hasOne(models.Roles, {
            onDelete: 'cascade',
        })
        Users.hasOne(models.Auths, {
            onDelete: 'cascade',
        })
    }

    return Users
}