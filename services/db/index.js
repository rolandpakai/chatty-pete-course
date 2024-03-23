import * as jsondb from './jsondb';
import * as mongodb from './mongodb';

const DB_TYPE = process.env.DB_TYPE || 'json';

const dbModules = {
  'json': jsondb,
  'mongodb': mongodb,
};

const { getAll, findOne, insertOne, findOneAndUpdate } = dbModules[DB_TYPE];


export { 
  getAll, 
  findOne, 
  insertOne, 
  findOneAndUpdate 
};