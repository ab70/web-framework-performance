const { Hono } = require('hono');
const { Sequelize, DataTypes } = require('sequelize');
const app = new Hono();

// Initialize Sequelize
const sequelize = new Sequelize('your_database', 'your_username', 'your_password', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false, // Set to true for SQL logs
});

// Define the User model
const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: false,
});

// Define the Post model
const Post = sequelize.define('Post', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
    },
}, {
    timestamps: false,
});

// Define the relation
Post.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Post, { foreignKey: 'user_id' });

// Test the database connection and sync models
sequelize.authenticate()
    .then(() => {
        console.log('Database connected');
        return sequelize.sync();
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

// Static data with dynamic elements
const staticUser = { name: 'John Doe' };
const staticPost = { title: 'Sample Post', content: 'This is a sample post content.' };

// Helper function to insert static data
async function insertStaticData() {
    // Insert a new static user every time
    const user = await User.create({
        name: `${staticUser.name} ${Date.now()}` // Dynamic name to make each user unique
    });

    // Insert a new static post with the new user reference
    const post = await Post.create({
        title: `${staticPost.title} ${Date.now()}`, // Dynamic title to make each post unique
        content: staticPost.content,
        user_id: user.id,
    });

    return { user, post };
}

// Define routes
app.get('/posts', async (c) => {
    try {
        // Insert new static data
        await insertStaticData();
        return c.json({ success: true });
    } catch (err) {
        return c.json({ message: err.message });
    }
});

app.get('/post', async (c) => {
    try {
        const post = await Post.findAll({ include: User });
        if (!post) {
            return c.json({ message: 'Post not found' }, 404);
        }
        return c.json(post);
    } catch (err) {
        return c.json({ message: err.message });
    }
});

app.get('/users', async (c) => {
    try {
        // Insert new static data
        await insertStaticData();
        return c.json({ success: true });
    } catch (err) {
        return c.json({ message: err.message });
    }
});

app.get('/health', (c) => c.text('Server is running'));

// Export the app for deployment
export default {
    fetch: app.fetch,
    port: 3000,
};
