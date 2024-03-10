const { MongoClient } = require('mongodb');


const uri = 'mongodb://localhost:27017';

const dbName = 'systemTest';


const rolesData = [
  { name: 'learner' },
  { name: 'lecturer' }
];

const coursesData = [
  { name: 'Nodejs', description: 'Backend ' },
  { name: 'Reactjs', description: 'Frontend' },
  { name: 'Mongodb', description: 'Database' }
];

async function insertData() {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
   
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);

    // Insert roles data
    const rolesCollection = db.collection('roles');
    const rolesResult = await rolesCollection.insertMany(rolesData);
    console.log(`${rolesResult.insertedCount} roles inserted`);

    // Insert courses data
    const coursesCollection = db.collection('courses');
    const coursesResult = await coursesCollection.insertMany(coursesData);
    console.log(`${coursesResult.insertedCount} courses inserted`);
  } catch (error) {
    console.error('Error inserting data:', error);
  } finally {
  
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}


insertData();
