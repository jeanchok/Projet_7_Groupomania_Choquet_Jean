const {DataTypes} = require('sequelize');
const {database} = require('./database');


const Comment = database.define('Comment',{
    content : {
        type : DataTypes.STRING,
        allowNull : false
    },
    attachment : {
        type : DataTypes.STRING,
    }
});

module.exports = Comment;