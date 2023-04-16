import { Todo, TodoInput } from "./types";
import _ from 'lodash';

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db');

export const resolvers = {
    Query: { getTodos },
    Mutation: { createTodo, updateTodo, deleteTodo }
};

function getTodos() {
    return new Promise(resolve => {
        const result: Todo[] = [];

        db.each("SELECT rowid, * FROM todo", (_err: any, row: Todo) => {
            result.push(row);
        }, () => resolve(result));
    });
}

function createTodo(_parent: any, { todo }: { todo: TodoInput }) {
    return new Promise(resolve => {
        const keys = _.keys(todo);
        const stmt = db.prepare(`
            INSERT INTO todo (${keys.map(_.snakeCase).join(',')})
            VALUES (${keys.map(k => '$' + k).join(',')})
        `);
        stmt.run(_.mapKeys(todo, (_, k) => '$' + k));
        stmt.finalize();
        resolve(true);
    });
}

function updateTodo(_parent: any, { id, todo }: { id: number, todo: TodoInput }) {
    return new Promise(resolve => {
        const keys = _.keys(todo);
        const stmt = db.prepare(`
            UPDATE todo
            SET ${keys.map(k => `${_.snakeCase(k)}=$${k}`).join(',')}
            WHERE rowid = $rowid
        `);
        stmt.run({ ... _.mapKeys(todo, (_, k) => '$' + k), $rowid: id });
        stmt.finalize();
        resolve(true);
    });
}

function deleteTodo(_parent: any, { id }: { id: number }) {
    return new Promise(resolve => {
        const stmt = db.prepare(`
            DELETE FROM todo
            WHERE rowid = $rowid
        `);
        stmt.run({ $rowid: id });
        stmt.finalize();
        resolve(true);
    });
}
