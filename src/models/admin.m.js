const db = require('../database/db');
const tbName = 'admin_';
module.exports = class Admin {

    constructor({ user_id }) {
        this.user_id=user_id;
    }

    static async getAll() {
        try {
            const data = await db.getAll(tbName);
            return data;
        }
        catch (error) {
            throw error;
        }
    }

    static async getCondition(tbColum, value) {
        try {
            const data = await db.getCondition(tbName, tbColum, value);
            return data;
        }
        catch (error) {
            throw error;
        }
    }

    static async insert(admin) {
        try {
            const data=await db.insert(tbName, admin,'user_id');
            return data;
        }
        catch (error) {
            throw error;
        }
    }
};