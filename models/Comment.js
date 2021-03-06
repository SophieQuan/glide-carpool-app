const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Comment extends Model {}

Comment.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    comment_text: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            len: [4]
        }
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isUrl: true,              // checks for url format
        }
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'user',
            key: 'id'
        }
    },
    event_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'event',
            key: 'id'
        }
    }
}, {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'comment'
});

module.exports = Comment;