module.exports = (sequelize, DataTypes) => {
    const Roles = sequelize.define('Roles', {
        Author: {
            type: DataTypes.STRING,
            defaultValue: 'true'
        },
        Administrator: {
            type: DataTypes.STRING,
            defaultValue: 'false'
        },
        Moderator: {
            type: DataTypes.STRING,
            defaultValue: 'false'
        }
    })

    Roles.associate = (models) => {
        Roles.belongsTo(models.Users, {
            onDelete: 'cascade',
        })
    }
    
    return Roles
}