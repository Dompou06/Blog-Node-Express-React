module.exports = (sequelize, DataTypes) => {
    const Suspends = sequelize.define('Suspends', {  
        Status: {
            type: DataTypes.STRING,
            defaultValue: 'false'
        },
        About: {
            type: DataTypes.STRING,
            allowNull: true
        }
    })
    Suspends.associate = (models) => {
        Suspends.belongsTo(models.Users, {
            onDelete: 'cascade',
        })
    }
    return Suspends
}