module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        "levels",
        {
            seq: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },

            level: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: true
            },

            inserted: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize.literal('now()')
            },

            updated: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize.literal('now()')
            },

            name: {
                type: DataTypes.STRING,
                allowNull: false
            },

            note: {
                type: DataTypes.STRING
            }
        },
        {
            timestamps: false,
            tableName: "levels"
        }
    );
};