require('dotenv').config();
const fs = require('fs');
const XLSX = require('xlsx');
const pgp = require('pg-promise')({
    capSQL: true
});

const cn = {
    // (có thể thay đổi các thuộc tính trong file .env)
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PW
};

const db = pgp(cn);

module.exports = {
    getAll: async (tbName) => {
        let dbcn = null;
        try {
            const query = `SELECT * FROM ${tbName}`;
            dbcn = await db.connect();
            const data = await dbcn.any(query);
            return data;
        }
        catch (error) {
            throw error;
        }
        finally {
            if (dbcn != null) {
                dbcn.done();
            }
        }
    },

    getCondition: async (tbName, tbColum, value) => {
        let dbcn = null;
        try {
            const query = `SELECT * FROM ${tbName} WHERE ${tbColum}='${value}'`;
            dbcn = await db.connect();

            const data = await dbcn.any(query);
            return data;
        }
        catch (error) {
            throw error;
        }
        finally {
            if (dbcn != null) {
                dbcn.done();
            }
        }
    },

    insert: async (tbName, entity, idreturn) => {
        try {
            const query = pgp.helpers.insert(entity, null, tbName);
            const data = await db.one(query + ` RETURNING ${idreturn};`);
            return data;

        } catch (err) {
            throw error;
        }
    },

    update: async (tbName, entity, tbColumn, value) => {
        let dbcn = null;
        try {
            dbcn = await db.connect();
            const query = pgp.helpers.update(entity, null, tbName);
            await dbcn.any(query + `WHERE ${tbColumn} = ${value}`, );

        } catch(error) {
            throw error;
        }
    },

    getAllInforUser: async () => {
        let dbcn = null;
        try {
            const query = `select user_.user_id,account.account_email,user_.user_name  from account  join user_  on account.account_id=user_.account_id`;
            dbcn = await db.connect();

            const data = await dbcn.any(query);
            return data;
        }
        catch (error) {
            throw error;
        }
        finally {
            if (dbcn != null) {
                dbcn.done();
            }
        }
    },

    getUserWithAccountId: async (accountId) => {
        let dbcn = null;
        try {
            const query = `SELECT get_user_with_account_id($1)`;
            dbcn = await db.connect();

            const data = await dbcn.any(query, [accountId]);
            const resultString = data[0].get_user_with_account_id;
            const matches = resultString.match(/\(([^)]+)\)/);
            const values = matches[1].split(',');

            const userObject = {
                user_id: parseInt(values[0]),
                account_id: parseInt(values[1]),
                user_name: values[2].replace(/"/g, ''), 
                user_role: values[3].replace(/"/g, ''), 
            };

            return userObject;
        }
        catch (error) {
            throw error;
        }
        finally {
            if (dbcn != null) {
                dbcn.done();
            }
        }
    },

    countItem: async (tbName, tbColum, tbValue) => {
        let dbcn = null;
        try {
            const query = `select count(*) from ${tbName} where ${tbColum}='${tbValue}' `;
            dbcn = await db.connect();

            const data = await dbcn.any(query);
            return data;
        }
        catch (error) {
            throw error;
        }
        finally {
            if (dbcn != null) {
                dbcn.done();
            }
        }
    },

    getByJoin: async (tbName1, tbName2, tbColumn, value) => {
        let dbcn = null;
        try {
            const query = `select * from ${tbName1} natural join ${tbName2} where ${tbName1}.${tbColumn} = ${value}`;

            dbcn = await db.connect();

            const data = await dbcn.any(query);
            return data;
        }
        catch (error) {
            throw error;
        }
        finally {
            if (dbcn != null) {
                dbcn.done();
            }
        }
    },

    getUpcommingEvents: async (courseId) => {
        let dbcn = null;

        try {
            const query = `select * from exercise join topic 
            on exercise.topic_id = topic.topic_id
            where duetime > NOW() and topic.course_id = ${courseId}`;

            dbcn = await db.connect();

            const data = await dbcn.any(query);
            return data;
        }
        catch (error) {
            throw error;
        }
        finally {
            if (dbcn != null) {
                dbcn.done();
            }
        }
    },

    getFinalScore: async (courseId, userId) => {
        let dbcn = null;

        try {
            const query = `select finalscore from course_student 
            where course_id = ${courseId} and user_id = ${userId}`;

            dbcn = await db.connect();

            const data = await dbcn.any(query);
            return data;
        }
        catch (error) {
            throw error;
        }
        finally {
            if (dbcn != null) {
                dbcn.done();
            }
        }
    },

    importDataFromExcel: async (object) => {
        let dbcn = null;
        try {
        
          for (const stundet of object.students) {
            const query = `INSERT INTO Course_Student(Course_id, User_id) VALUES ($1, $2)`;
            const values = [object.id, stundet]; 
            dbcn = await db.connect();
            await dbcn.query(query, values);
          }
        } 
        catch (error) {
            throw error;
        }
        finally {
            if (dbcn != null) {
                dbcn.done();
            }
        }
    },
    getTwoCondition: async (tbName, tbColum1,tbColum2, value1,value2) => {
        let dbcn = null;
        try {
            const query = `SELECT * FROM ${tbName} WHERE ${tbColum1}='${value1}' and ${tbColum2}='${value2}' `;
            dbcn = await db.connect();

            const data = await dbcn.any(query);
            return data;
        }
        catch (error) {
            throw error;
        }
        finally {
            if (dbcn != null) {
                dbcn.done();
            }
        }
    },

    deleteTwoCOndition: async (tbName, tbColum1,tbColum2, value1,value2) => {
        let dbcn = null;
        try {
            const query = `DELETE FROM ${tbName} WHERE ${tbColum1}='${value1}' and ${tbColum2}='${value2}' `;
            dbcn = await db.connect();

            const data = await dbcn.any(query);
            return data;
        }
        catch (error) {
            throw error;
        }
        finally {
            if (dbcn != null) {
                dbcn.done();
            }
        }
    },

    DeleteUser:async(courseId, userId)=>{
        let dbcn = null;

        try {
            dbcn = await db.connect();
            const query = 'SELECT delete_user($1, $2)'
            await dbcn.any(query, [courseId, userId]);
        }
        catch (error) {
            throw error;
        }
        finally {
            if (dbcn != null) {
                dbcn.done();
            }
        }
    },

    addStudent:async(courseId, userId)=>{
        let dbcn = null;
        
        try {
            dbcn = await db.connect();
            const query = 'SELECT add_student($1, $2)'
            await dbcn.any(query, [courseId, userId]);
        }
        catch (error) {
            throw error;
        }
        finally {
            if (dbcn != null) {
                dbcn.done();
            }
        }
    },

    addTeacher:async(courseId, userId)=>{
        let dbcn = null;

        try {
            dbcn = await db.connect();
            const query = 'SELECT add_teacher($1, $2)'
            await dbcn.any(query, [courseId, userId]);
        }
        catch (error) {
            throw error;
        }
        finally {
            if (dbcn != null) {
                dbcn.done();
            }
        }
    },

    updateScoreForSubmission: async(user_id, exercise_id, score) => {
        let dbcn = null;

        try {
            dbcn = await db.connect();
            const query = 'SELECT update_score_for_submission($1, $2, $3)'
            await dbcn.any(query, [user_id, exercise_id, score]);
        }
        catch (error) {
            throw error;
        }
        finally {
            if (dbcn != null) {
                dbcn.done();
            }
        }
    },

    updateFinalScoreForCourseStudent: async(user_id, course_id, finalscore) => {
        let dbcn = null;
        try {
            dbcn = await db.connect();
            const query = 'SELECT update_final_score_for_course_student($1, $2, $3)'
            await dbcn.any(query, [user_id, course_id, finalscore]);
        }
        catch (error) {
            throw error;
        }
        finally {
            if (dbcn != null) {
                dbcn.done();
            }
        }
    },

    deleteCourse: async(course_id) => {
        let dbcn = null;
        try {
            dbcn = await db.connect();
            await db.any('SELECT delete_course($1)', [course_id]);
        }
        catch (error) {
            throw error;
        }
        finally {
            if (dbcn != null) {
                dbcn.done();
            }
        }
    },

    deleteAllInforInCourse: async (courseId, nameTable) => {
        let dbcn = null;

        try {
            const query = `delete from ${nameTable} where course_id='${courseId}'`;

            dbcn = await db.connect();

            const data = await dbcn.any(query);
            return data;
        }
        catch (error) {
            throw error;
        }
        finally {
            if (dbcn != null) {
                dbcn.done();
            }
        }
    },

    UpdateScore: async (exercise_id, user_id, score) =>{
        let dbcn = null;
        try {
            dbcn = await db.connect();
            const query = 'SELECT update_score($1, $2, $3)';
            await dbcn.any(query, [exercise_id, user_id, score]);
        }
        catch (error) {
            throw error;
        }
        finally {
            if (dbcn != null) {
                dbcn.done();
            }
        }
    },

    UpdateFinalScore: async (course_id, user_id, score) =>{
        let dbcn = null;
        try {
            dbcn = await db.connect();
            const query = 'SELECT update_finalscore($1, $2, $3)';
            await dbcn.any(query, [course_id, user_id, score]);
        }
        catch (error) {
            throw error;
        }
        finally {
            if (dbcn != null) {
                dbcn.done();
            }
        }
    }
};
