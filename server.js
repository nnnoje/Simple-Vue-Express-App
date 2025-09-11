const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
app.use(cors());

const items = [
  { 
    id: 1, 
    name: "SCARFACE", 
    image: "http://localhost:3000/images/85c67764482968f354e11875aff69f2d.jpg" 
  },
  { 
    id: 2, 
    name: "SE7EN", 
    image: "http://localhost:3000/images/a759305edb3c7c6a3e1aa0cef50b6657.jpg" 
  },
  { 
    id: 3, 
    name: "WHIPLASH", 
    image: "http://localhost:3000/images/7d97990791fb736059f5a669613e9f3c.jpg" 
  },
  { 
    id: 4, 
    name: "REQUIEM FOR A DREAM", 
    image: "http://localhost:3000/images/baf93be3d6aaaf5b489540f65978d2cd.jpg" 
  },
  { 
    id: 5, 
    name: "SINNERS",   
    image: "http://localhost:3000/images/0618c8c96835e26cd2f9e1d2944cf9ba.jpg" 
  },
  { 
    id: 6, 
    name: "SPEAK NO EVIL",  // ✅ new text
    image: "http://localhost:3000/images/de48b6fc4db56abf2a86bff02ed85643.jpg" // ✅ new image
  }
];

app.use("/images", express.static("images"));

app.get("/api/items", (req, res) => {
  res.json(items);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
