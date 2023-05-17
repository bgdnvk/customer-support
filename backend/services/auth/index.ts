import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Pool } from 'pg';

const app = express();
const port = process.env.PORT || 3000;

console.log('JWT secret', process.env.JWT_SECRET)
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: process.env.NODE_ENV === 'production',
// });

// Create a PostgreSQL pool
const pool = new Pool({
  user: 'admin',
  host: '10.109.2.89',
  database: 'postgres',
  password: 'password',
  port: 5432 // or the port number you are using
});

app.use(express.json());

// interface User {
//   id: number;
//   username: string;
//   password: string;
// }

app.get('/', async (req: Request, res: Response, next: NextFunction) => {
  return res.status(200).json({message: 'works'})
})


// Register a new user
app.post('/register', async (req: Request, res: Response) => {

  console.log('register hit')
  console.log('red body', req.body)
  try {
    const { username, password } = req.body;

    // Check if username already exists
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2)',
      [username, hashedPassword]
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// User login
app.post('/login', async (req: Request, res: Response) => {
  console.log('login hit')
  console.log('req body', req.body)
  try {
    const { username, password } = req.body;

    // Retrieve the user from the database
    const user = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    if (user.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify the password
    const passwordMatch = await bcrypt.compare(
      password,
      user.rows[0].password
    );

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user.rows[0].id },
      'your_secret_key',
      { expiresIn: '1h' } // Token expiration time
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});






// app.post('/login', async (req: Request, res: Response, next: NextFunction) => {
//   const { username, password } = req.body;

//   try {
//     // Query the database for the user with the given username
//     const result = await pool.query<User>(
//       'SELECT * FROM users WHERE username = $1',
//       [username]
//     );

//     const user = result.rows[0];

//     if (!user) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     // Compare the password hash to the user's password
//     const match = await bcrypt.compare(password, user.password);

//     if (!match) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     // Generate a JWT and send it in the response
//     const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
//     res.json({ token });
//   } catch (err) {
//     next(err);
//   }
// });

// app.get('/protected', (req: Request, res: Response, next: NextFunction) => {
//   const token = req.headers.authorization?.split(' ')[1];

//   if (!token) {
//     return res.status(401).json({ message: 'Missing authorization header' });
//   }

//   try {
//     // Verify the JWT and extract the user ID
//     const { userId } = jwt.verify(token, process.env.JWT_SECRET) as { userId: number };
//     res.json({ message: `Protected data for user ${userId}` });
//   } catch (err) {
//     next(err);
//   }
// });

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
