module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        "accounts",
        {
            seq: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },

            inserted: {
                type: DataTypes.DATE,
                defaultValue: sequelize.literal('now()')
            },

            updated: {
                type: DataTypes.DATE,
                defaultValue: sequelize.literal('now()')
            },

            id: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },

            password: {
                type: DataTypes.STRING,
                allowNull: false
            },

            name: {
                type: DataTypes.STRING,
                allowNull: false
            },

            phone: {
                type: DataTypes.STRING
            },

            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },

            levelSeq: {
                type: DataTypes.INTEGER,
                allowNull: true,
                field: 'level_seq'
            },

            salt: {
                type: DataTypes.STRING
            }
        },
        {
            timestamps: false,
            tableName: "accounts"
        }
    );
};