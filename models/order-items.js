const Sequelize = require('sequelize');
const sequelize = require('../util/javascript');

const orderItems = sequelize.define('orderItems',{
    id: {
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    quantity : Sequelize.INTEGER
});

module.exports = orderItems;