CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255),
  rating INTEGER CHECK (rating BETWEEN 1 AND 10),
  notes TEXT,
  date_read DATE,
  cover_url TEXT
);