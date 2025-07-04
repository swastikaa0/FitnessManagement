const express = require("express");
const {Sequelize} = require("sequelize");

const sequelize = new Sequelize("postgres","GroupProject","9828810791",{
    host: "localhost",
    dialect : "postgres"
});

const connection = async () => {
    try{
        await sequelize.authenticate();
        console.log("Connection has been established");
    }
    catch (error){
        console.error("Unable to connect database: ",error);
    }
};

module.exports = {sequelize, connection};

