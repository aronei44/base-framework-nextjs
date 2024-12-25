import { Dialect, Sequelize } from 'sequelize';
import getConfig from './config';
import pg from 'pg';

const conn = async () => {
    const config = await getConfig();

    const sequelize = new Sequelize(`${config.DB_DIALECT}://${config.DB_USER}:${config.DB_PASSWORD}@${config.DB_HOST}:${config.DB_PORT}/${config.DB_NAME}`, {
        dialect: config.DB_DIALECT as Dialect,
        dialectModule: pg,
        logging: false
    })

    return sequelize
}


export default conn;