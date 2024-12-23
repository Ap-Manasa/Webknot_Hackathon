const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');  
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());  // Allow cross-origin requests
app.use(express.json());  // Parse JSON request bodies

// MySQL Database Connection
const db = mysql.createConnection({
  host: 'localhost',         
  user: 'root',              
  password: 'prajwaltp',     
  database: 'event_management',      
});

// Test the database connection
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1);  // Exit the process on error
  }
  console.log('Connected to MySQL database!');
});

// GET /api/events - Fetch all events
app.get('/api/events', (req, res) => {
  const query = 'SELECT * FROM events';  // SQL query to fetch all events
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching events:', err);
      return res.status(500).json({ error: 'Error fetching events from database' });
    }
    res.json(results);  // Return the fetched events as JSON
  });
});

// POST /api/events - Add a new event
app.post('/api/events', (req, res) => {
  const { name, description, location, date } = req.body;

  // Validate input
  if (!name || !description || !location || !date) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  const query = 'INSERT INTO events (name, description, location, date) VALUES (?, ?, ?, ?)';
  db.query(query, [name, description, location, date], (err, result) => {
    if (err) {
      console.error('Error inserting event:', err);
      return res.status(500).json({ error: 'Error adding event to database' });
    }
    
    // Return the newly created event (with the inserted ID)
    res.status(201).json({
      id: result.insertId,  // The ID of the newly created event
      name,
      description,
      location,
      date,
    });
  });
});

// PUT /api/events/:id - Update an existing event
app.put('/api/events/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, location, date } = req.body;

  // Validate input
  if (!name || !description || !location || !date) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  const query = 'UPDATE events SET name = ?, description = ?, location = ?, date = ? WHERE id = ?';
  db.query(query, [name, description, location, date, id], (err, result) => {
    if (err) {
      console.error('Error updating event:', err);
      return res.status(500).json({ error: 'Error updating event in database' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json({ id, name, description, location, date });  // Return the updated event data
  });
});

// DELETE /api/events/:id - Delete an event
app.delete('/api/events/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM events WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting event:', err);
      return res.status(500).json({ error: 'Error deleting event from database' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.status(204).send();  // No content, successfully deleted
  });
});

// Add an Attendee
app.post('/api/attendees', (req, res) => {
    const { name } = req.body;
  
    if (!name) {
      return res.status(400).json({ error: 'Attendee name is required!' });
    }
  
    const query = 'INSERT INTO attendees (name) VALUES (?)';
    db.query(query, [name], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Error adding attendee to database' });
      }
      res.status(201).json({ id: result.insertId, name });
    });
  });
  
  // Get all Attendees
  app.get('/api/attendees', (req, res) => {
    const query = 'SELECT * FROM attendees';
    db.query(query, (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error fetching attendees from database' });
      }
      res.json(results);
    });
  });
  
  // Delete an Attendee
  app.delete('/api/attendees/:id', (req, res) => {
    const { id } = req.params;
  
    const query = 'DELETE FROM attendees WHERE id = ?';
    db.query(query, [id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Error deleting attendee from database' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Attendee not found' });
      }
      res.status(204).send();
    });
  });

// Add Task
app.post('/api/tasks', (req, res) => {
    const { name, status, deadline, event_id, attendee_id } = req.body;
    const query = 'INSERT INTO tasks (name, status, deadline, event_id, attendee_id) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [name, status, deadline, event_id, attendee_id], (err, result) => {
      if (err) return res.status(500).json({ error: 'Error adding task' });
      res.status(201).json({ id: result.insertId, name, status, deadline, event_id, attendee_id });
    });
  });
  
  // Get Tasks for Event
  app.get('/api/tasks/:event_id', (req, res) => {
    const { event_id } = req.params;
    const query = 'SELECT * FROM tasks WHERE event_id = ?';
    db.query(query, [event_id], (err, results) => {
      if (err) return res.status(500).json({ error: 'Error fetching tasks for event' });
      res.json(results);
    });
  });
  
  // Update Task Status
  app.put('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const query = 'UPDATE tasks SET status = ? WHERE id = ?';
    db.query(query, [status, id], (err, result) => {
      if (err) return res.status(500).json({ error: 'Error updating task status' });
      res.json({ id, status });
    });
  });
  
  app.post('/api/assign-attendee', (req, res) => {
    const { attendeeId, eventId } = req.body;
  
    // Logic to assign the attendee to the event
    const query = 'INSERT INTO event_attendees (attendee_id, event_id) VALUES (?, ?)';
    db.query(query, [attendeeId, eventId], (err, result) => {
      if (err) return res.status(500).json({ error: 'Error assigning attendee to event' });
      
      res.status(200).json({ message: 'Attendee assigned to event' });
    });
  });
  

  app.post('/api/assign-attendee-task', (req, res) => {
    const { attendeeId, taskId } = req.body;
  
    // Insert into attendee_tasks
    const query = 'INSERT INTO attendee_tasks (attendee_id, task_id) VALUES (?, ?)';
    db.query(query, [attendeeId, taskId], (err, result) => {
      if (err) return res.status(500).json({ error: 'Error assigning attendee to task' });
  
      res.status(200).json({ message: 'Attendee assigned to task' });
    });
  });




// Sign-Up Endpoint
app.post('/api/signup', (req, res) => {
  const { username, password, security_question } = req.body;
  const query = 'INSERT INTO users (username, password, security_question) VALUES (?, ?, ?)';
  db.query(query, [username, password, security_question], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error signing up' });
    res.status(200).json({ message: 'User signed up successfully' });
  });
});

// Login Endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  db.query(query, [username, password], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error logging in' });
    if (results.length === 0) return res.status(401).json({ message: 'Invalid credentials' });
    res.status(200).json({ message: 'Login successful' });
  });
});

// Forgot Password Endpoint
app.post('/api/forgot', (req, res) => {
  const { username, security_answer, new_password } = req.body;
  const query = 'UPDATE users SET password = ? WHERE username = ? AND security_question = ?';
  db.query(query, [new_password, username, security_answer], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error resetting password' });
    if (result.affectedRows === 0) return res.status(400).json({ message: 'Invalid details' });
    res.status(200).json({ message: 'Password updated successfully' });
  });
});

// Serve Pages
app.get('/eventmanager', (req, res) => res.sendFile(__dirname + '/views/eventmanager.html'));
app.get('/attendeemanager', (req, res) => res.sendFile(__dirname + '/views/attendeemanager.html'));
app.get('/taskmanager', (req, res) => res.sendFile(__dirname + '/views/taskmanager.html'));
  

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
