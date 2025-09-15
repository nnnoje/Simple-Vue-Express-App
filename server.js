const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");

app.use(cors());
app.use(express.json());

let items = [
  { 
    id: 1, 
    name: "SCARFACE", 
    image: "http://localhost:3000/images/85c67764482968f354e11875aff69f2d.jpg",
    rating: 0,
    reviews: []
  },
  { 
    id: 2, 
    name: "SE7EN", 
    image: "http://localhost:3000/images/a759305edb3c7c6a3e1aa0cef50b6657.jpg",
    rating: 0,
    reviews: []
  },
  { 
    id: 3, 
    name: "WHIPLASH", 
    image: "http://localhost:3000/images/7d97990791fb736059f5a669613e9f3c.jpg",
    rating: 0,
    reviews: []
  },
  { 
    id: 4, 
    name: "REQUIEM FOR A DREAM", 
    image: "http://localhost:3000/images/baf93be3d6aaaf5b489540f65978d2cd.jpg",
    reviews: []
  },
  { 
    id: 5, 
    name: "SINNERS",   
    image: "http://localhost:3000/images/0618c8c96835e26cd2f9e1d2944cf9ba.jpg",
    reviews: []
  },
  { 
    id: 6, 
    name: "SPEAK NO EVIL",  
    image: "http://localhost:3000/images/de48b6fc4db56abf2a86bff02ed85643.jpg",
    reviews: []
  }
];

// serve static images
app.use("/images", express.static("images"));

// GET all movies
app.get("/api/items", (req, res) => {
  res.json(items);
});

// PUT update rating
app.put("/api/items/:id/rating", (req, res) => {
  const id = parseInt(req.params.id);
  const { rating } = req.body;

  const movie = items.find(i => i.id === id);
  if (!movie) return res.status(404).send("Movie not found");

  movie.rating = rating;
  res.json(movie);
});

// POST add review to movie
app.post("/api/items/:id/reviews", (req, res) => {
  const id = parseInt(req.params.id);
  const { review } = req.body;
  
  const movie = items.find(i => i.id === id);
  if (!movie) return res.status(404).send("Movie not found");
  
  movie.reviews.push(review);
  res.json(movie);
});

// DELETE remove review from movie
app.delete("/api/items/:id/reviews/:reviewIndex", (req, res) => {
  const id = parseInt(req.params.id);
  const reviewIndex = parseInt(req.params.reviewIndex);
  
  const movie = items.find(i => i.id === id);
  if (!movie) return res.status(404).send("Movie not found");
  
  if (reviewIndex >= 0 && reviewIndex < movie.reviews.length) {
    movie.reviews.splice(reviewIndex, 1);
  }
  
  res.json(movie);
});

app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});