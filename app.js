const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = express();
dotenv.config();

const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  family: 4,
});

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please enter a title for your post."],
  },
  content: {
    type: String,
    required: [true, "Your post cannot be empty."],
  },
});

const Post = mongoose.model("Post", postSchema);

const homeStartingContent =
  "Welcome to Camilito Blog, a place where you can get a glimpse into my daily life and tech projects. I'm excited to share with you my experiences, thoughts, and learnings as I navigate the fast-paced world of technology. As a tech enthusiast, I'm always tinkering with new gadgets and exploring the latest software tools. In this blog, you'll find a mix of personal anecdotes and technical tutorials, all geared towards helping you make the most out of your digital life. Whether you're a seasoned tech pro or just getting started, there's something here for everyone. So join me on this journey as I share my passion for all things tech and beyond!";

const aboutContent =
  "My name is Camilo Joga and I'm excited to share with you my passion for all things tech and beyond. As a tech enthusiast, I spend a lot of my time exploring new gadgets, software tools, and cutting-edge technologies. I also enjoy sharing my daily experiences and learnings with my readers. This blog is a space where I can combine these two passions and offer a glimpse into my world. On this website, you can expect to find a mix of personal anecdotes and technical tutorials. I'll be sharing stories from my travels, insights on current events, and reviews of my favorite products. I'll also be discussing my latest tech projects, providing tips and tricks to help you optimize your digital life, and sharing my thoughts on the latest industry trends. \nMy hope is that this blog will serve as a resource for anyone looking to learn more about the intersection of technology and daily life. Whether you're a seasoned tech pro or just getting started, there's something here for everyone. So join me on this journey of discovery and exploration as we explore the fascinating world of tech together!";

const contactContent =
  "Welcome to the Contact page of Camilito Blog! I'd love to hear from you and answer any questions you may have about my blog or tech-related topics. Please feel free to get in touch with me using the contact form below. If you have any feedback or suggestions for topics you'd like to see covered on the blog, I'd love to hear from you. I'm always looking for ways to improve and make the blog more useful to my readers. \nAdditionally, if you're interested in working with me on a tech project or collaboration, please reach out using the contact form below. I'm always open to new opportunities and love working with like-minded individuals. \n Thank you for visiting my blog and taking the time to connect with me. I look forward to hearing from you soon!";

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  Post.find().then((posts) => {
    res.render("home", {
      homeStartingContent: homeStartingContent,
      homePosts: posts,
    });
  });
});

app.get("/about", (req, res) =>
  res.render("about", { aboutContent: aboutContent })
);

app.get("/contact", (req, res) =>
  res.render("contact", { contactContent: contactContent })
);

app.get("/posts/:postId", (req, res) => {
  const PostId = req.params.postId;
  Post.findOne({ _id: PostId }).then((post) => {
    res.render("post", {
      postTitle: post.title,
      postContent: post.content,
    });
  });
});

app.get("/compose", (req, res) => res.render("compose"));

app.post("/compose", (req, res) => {
  let postTitle = req.body.postTitle.trim();
  const post = {
    title: postTitle,
    content: req.body.postBody,
  };
  Post.create(post).catch((err) => console.log(err));
  res.redirect("/");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
