// Import sequelize
// eslint-disable-next-line no-unused-vars
const {Sequelize, DataTypes} = require('sequelize');

//Try connecting to database


const dbConnect =  async () => {
    try{
        console.log(process.env.CONNECTION_STRING); // Debugging step
        const sequelize = new Sequelize(process.env.CONNECTION_STRING, {
            dialect: 'postgres',
            logging: false,
        });

        await sequelize.authenticate();
        console.log(`Database connected : ${sequelize.config.host}, ${sequelize.config.database}`);

        //return sequelize instance
        return sequelize;

    } catch (err) {
        console.log("oops"); //debug step
        console.log(err);
        process.exit(1);
    }
};

module.exports = dbConnect;  //to allow imports in other modules