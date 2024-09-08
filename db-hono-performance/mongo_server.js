const { Hono } = require('hono');
const mongoose = require('mongoose');
const app = new Hono();

// MongoDB connection setup
const uri = 'mongodb://localhost:27017/your_database';
mongoose.connect(uri, {})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

// Define schemas and models
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
});

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);

// Static data
const staticUser = { name: 'John Doe' };
const staticPost = { title: 'Sample Post', content: 'This is a sample post content.' };

// Helper function to insert static data
async function insertStaticData() {
    // Insert a new static user every time
    const user = new User({ name: `${staticUser.name} ${Date.now()}` });
    await user.save();

    // Insert a new static post with the new user reference
    const post = new Post({
        title: `${staticPost.title} ${Date.now()}`,
        content: staticPost.content,
        user_id: user._id,
    });
    await post.save();

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
        const posts = await Post.find({}).populate('user_id');
        if (!posts) {
            return c.json({ message: 'Post not found' }, 404);
        }
        return c.json(posts);
    } catch (err) {
        console.log(err);
        return c.json({ message: err.message });
    }
});

app.get('/users', async (c) => {
    try {
        // Insert new static data
        // const { user } = await insertStaticData();
        const deleteUsers = await User.deleteMany({})
        const deletePost = await Post.deleteMany({})
        const allUsrs = await User.find()
        const allPosts = await Post.find()

        return c.json({ success: true, users: allUsrs, posts: allPosts });
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