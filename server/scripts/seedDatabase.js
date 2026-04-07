import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "../models/User.js";
import Post from "../models/Post.js";

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});
    console.log("🗑️  Cleared existing data");

    // Create sample users with properly hashed passwords
    const salt = await bcrypt.genSalt();
    const users = await User.insertMany([
      {
        firstName: "John",
        lastName: "Doe",
        email: "john@gmail.com",
        password: await bcrypt.hash("password123", salt),
        picturePath: "p1.jpeg",
        friends: [],
        location: "San Francisco, CA",
        occupation: "Software Engineer",
        viewedProfile: Math.floor(Math.random() * 10000),
        impressions: Math.floor(Math.random() * 10000),
      },
      {
        firstName: "Jane",
        lastName: "Smith",
        email: "jane@gmail.com",
        password: await bcrypt.hash("password123", salt),
        picturePath: "p2.jpeg",
        friends: [],
        location: "New York, NY",
        occupation: "Product Manager",
        viewedProfile: Math.floor(Math.random() * 10000),
        impressions: Math.floor(Math.random() * 10000),
      },
      {
        firstName: "Mike",
        lastName: "Johnson",
        email: "mike@gmail.com",
        password: await bcrypt.hash("password123", salt),
        picturePath: "p3.jpeg",
        friends: [],
        location: "Austin, TX",
        occupation: "Data Scientist",
        viewedProfile: Math.floor(Math.random() * 10000),
        impressions: Math.floor(Math.random() * 10000),
      },
      {
        firstName: "Sarah",
        lastName: "Williams",
        email: "sarah@gmail.com",
        password: await bcrypt.hash("password123", salt),
        picturePath: "p4.jpeg",
        friends: [],
        location: "Seattle, WA",
        occupation: "UX Designer",
        viewedProfile: Math.floor(Math.random() * 10000),
        impressions: Math.floor(Math.random() * 10000),
      },
    ]);

    console.log(`✅ Created ${users.length} users`);

    // Add some friendships
    users[0].friends.push(users[1]._id);
    users[1].friends.push(users[0]._id);
    users[0].friends.push(users[2]._id);
    users[2].friends.push(users[0]._id);
    users[1].friends.push(users[3]._id);
    users[3].friends.push(users[1]._id);

    await Promise.all(users.map((user) => user.save()));
    console.log("✅ Added friendships");

    // Create sample posts
    const posts = await Post.insertMany([
      {
        userId: users[0]._id,
        firstName: users[0].firstName,
        lastName: users[0].lastName,
        location: users[0].location,
        description: "Had an amazing day at the tech conference today!",
        picturePath: "post1.jpeg",
        userPicturePath: users[0].picturePath,
        likes: new Map(),
        comments: [],
      },
      {
        userId: users[1]._id,
        firstName: users[1].firstName,
        lastName: users[1].lastName,
        location: users[1].location,
        description: "Working on an exciting new product launch. Can't wait to share details soon!",
        picturePath: "post2.jpeg",
        userPicturePath: users[1].picturePath,
        likes: new Map(),
        comments: [],
      },
      {
        userId: users[2]._id,
        firstName: users[2].firstName,
        lastName: users[2].lastName,
        location: users[2].location,
        description: "Just finished analyzing a massive dataset. Machine learning is fascinating!",
        picturePath: "",
        userPicturePath: users[2].picturePath,
        likes: new Map(),
        comments: [],
      },
      {
        userId: users[3]._id,
        firstName: users[3].firstName,
        lastName: users[3].lastName,
        location: users[3].location,
        description: "Design thinking workshop was enlightening. Great insights from the team!",
        picturePath: "post3.jpeg",
        userPicturePath: users[3].picturePath,
        likes: new Map(),
        comments: [],
      },
    ]);

    console.log(`✅ Created ${posts.length} posts`);

    // Add some likes
    posts[0].likes.set(users[1]._id.toString(), true);
    posts[0].likes.set(users[2]._id.toString(), true);
    posts[1].likes.set(users[0]._id.toString(), true);

    await Promise.all(posts.map((post) => post.save()));
    console.log("✅ Added likes to posts");

    console.log("\n✨ Database seeded successfully!");
    console.log("\n📝 Test Credentials:");
    console.log("   Email: john@gmail.com | Password: password123");
    console.log("   Email: jane@gmail.com | Password: password123");
    console.log("   Email: mike@gmail.com | Password: password123");
    console.log("   Email: sarah@gmail.com | Password: password123");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
