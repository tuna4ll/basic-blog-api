const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Post = require('./models/Post');

const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/blog-api', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB\'ye bağlanıldı'))
  .catch((err) => console.error('MongoDB bağlantı hatası:', err));

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Blog API\'si çalışıyor!');
});

app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Yazılar alınırken bir hata oluştu.' });
  }
});

app.post('/posts', async (req, res) => {
  const { title, content, author } = req.body;

  const newPost = new Post({
    title,
    content,
    author,
  });

  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(400).json({ message: 'Yazı oluşturulurken bir hata oluştu.' });
  }
});

app.get('/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Yazı bulunamadı.' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Yazı alınırken bir hata oluştu.' });
  }
});

app.put('/posts/:id', async (req, res) => {
  const { title, content, author } = req.body;

  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { title, content, author },
      { new: true } // Güncellenmiş postu döndür
    );
    
    if (!updatedPost) {
      return res.status(404).json({ message: 'Yazı bulunamadı.' });
    }

    res.json(updatedPost);
  } catch (error) {
    res.status(400).json({ message: 'Yazı güncellenirken bir hata oluştu.' });
  }
});

app.delete('/posts/:id', async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    
    if (!deletedPost) {
      return res.status(404).json({ message: 'Yazı bulunamadı.' });
    }

    res.status(204).send(); // 204 No Content
  } catch (error) {
    res.status(500).json({ message: 'Yazı silinirken bir hata oluştu.' });
  }
});

app.listen(port, () => {
  console.log(`Blog API'si ${port} numaralı portta çalışıyor`);
});
