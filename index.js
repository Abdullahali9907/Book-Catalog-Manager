import express from "express";
import pg from "pg";
// import axios from "axios";
import bodyParser from "body-parser";

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "mybooks",
  password: "8052",
  port: 5432,
});

db.connect();

const app = express();
const port = 3000;

// app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  const sort = req.query.sort || "date_read DESC";
  try {
    const result = await db.query(`SELECT * FROM books ORDER BY ${sort}`);
    res.render("index.ejs", { books: result.rows });
  } catch (error) {
    res.sendStatus(500).send("Internal Connection Error");
  }
});

app.get("/add", (req, res) => {
  res.render("book_form.ejs", { book: null });
});

app.post("/add", async (req, res) => {
  const { title, author, rating, notes, date_read } = req.body;
  const cover_url = `https://covers.openlibrary.org/b/Title/${encodeURIComponent(
    title
  )}-M.jpg`;
  try {
    await db.query(
      "INSERT INTO books (title, author, rating, notes, date_read, cover_url) VALUES ($1, $2, $3, $4, $5, $6)",
      [title, author, rating, notes, date_read, cover_url]
    );
    res.redirect("/");
  } catch (error) {
    sendStatus(500).send("Internal Connection Error");
  }
});

app.get("/edit/:id", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM books WHERE id = $1", [
      req.params.id,
    ]);
    res.render("book_form.ejs", { book: result.rows[0] });
  } catch (error) {
    sendStatus(500).send("Internal Connection Error");
  }
});

app.post("/edit/:id", async (req, res) => {
  const { title, author, rating, notes, date_read } = req.body;
  const cover_url = `https://covers.openlibrary.org/b/Title/${encodeURIComponent(
    title
  )}-M.jpg`;

  try {
    await db.query(
      `UPDATE books 
     SET title=$1, author=$2, rating=$3, notes=$4, date_read=$5, cover_url=$6 
     WHERE id=$7`,
      [title, author, rating, notes, date_read, cover_url, req.params.id]
    );

    res.redirect("/");
  } catch (error) {
    sendStatus(500).send("Internal Connection Error");
  }
});

app.post("/delete/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM books WHERE id = $1", [req.params.id]);
    res.redirect("/");
  } catch (error) {
    sendStatus(500).send("Internal Connection Error");
  }
});


app.listen(port, () => {
  console.log(`Server is running on ${port} sucessfully.`);
});
