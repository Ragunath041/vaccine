require('dotenv').config();
const db = require('./config/db');

async function checkDatabase() {
    try {
        // Check which database we're connected to
        const [dbResult] = await db.query('SELECT DATABASE() as db_name');
        console.log('Currently connected to database:', dbResult[0].db_name);

        // List all tables in the current database
        const [tables] = await db.query('SHOW TABLES');
        console.log('\nTables in the database:');
        tables.forEach(table => {
            console.log('-', Object.values(table)[0]);
        });

        // Check if users table exists and count records
        const [userCount] = await db.query('SELECT COUNT(*) as count FROM users');
        console.log('\nNumber of users in the database:', userCount[0].count);

    } catch (error) {
        console.error('Error checking database:', error);
        console.log('\nDatabase configuration:');
        console.log('Host:', process.env.DB_HOST);
        console.log('User:', process.env.DB_USER);
        console.log('Database:', process.env.DB_NAME);
    } finally {
        process.exit();
    }
}

checkDatabase(); 