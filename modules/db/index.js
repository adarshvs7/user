const knex = require('knex');
const knexfile = require('./knexfile');
const env = process.env.NODE_ENV || 'development';
const configOptions = knexfile[env];
const knexDB = knex(configOptions);
const dbUtils = require('../db/utils');


async function insertDoc(tableName, doc) {
    const dbResponse = await knexDB(tableName)
        .insert(doc)
        .returning('*');
    return dbUtils.parseWriteResponse(dbResponse);
}

async function updateDoc(tableName, id, doc) {
    const dbResponse = await knexDB(tableName)
        .where({ id })
        .update(doc)
        .returning('*');
    return dbUtils.parseWriteResponse(dbResponse);
}

async function updateWithCondition(tableName, whereCondition, doc) {
    const dbResponse = await knexDB(tableName)
        .where(whereCondition)
        .update(doc)
        .returning('*');
    return dbUtils.parseWriteResponse(dbResponse);
}

function getQueryBuilder(tableName) {
    return knexDB(tableName);
}
function createRaw(data) {
    return knexDB.raw(data)
}
async function executeQuery(queryBuilder) {
    const results = await queryBuilder;
    return results;
}

async function deleteDoc(tableName, condition) {
    const deleteResponse = await knexDB(tableName)
        .where(condition)
        .del();
    return deleteResponse;
}

module.exports = {
    insertDoc,
    updateDoc,
    getQueryBuilder,
    executeQuery,
    deleteDoc,
    createRaw,
    updateWithCondition
};
