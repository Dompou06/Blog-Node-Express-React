module.exports = (sequelize, DataTypes) => {
    const Auths = sequelize.define('Auths', {
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        firstname: {
            type: DataTypes.STRING,
            allowNull: true
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: true
        },
        address: {
            type: DataTypes.STRING,
            allowNull: true
        },
        cp: {
            type: DataTypes.STRING,
            allowNull: true
        },
        city: {
            type: DataTypes.STRING,
            allowNull: true
        },
        state: {
            type: DataTypes.STRING,
            defaultValue: 'France'
        },
        tel: {
            type: DataTypes.STRING,
            allowNull: true
        },
        mobile: {
            type: DataTypes.STRING,
            allowNull: true
        } 
    })

    Auths.associate = (models) => { 
        //Si ajout de la colonne ne fonctionne pas, supprimer tous les posts ou supprimer la table
        Auths.belongsTo(models.Users, {
            onDelete: 'cascade',
        })
    }
    return Auths
}