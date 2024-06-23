require('dotenv').config();
const express = require('express');
const http = require('http');
// const socketIo = require('socket.io');
const mongoose = require('mongoose');
const Message = require('./models/Message');
const User = require('./models/User');

const cors = require('cors')

const app = express();

const server = http.createServer(app);

const io = require('socket.io')(server, {cors: {origin: "*"}});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
});

let onlineUsers = {};
let users = {}

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Handle user online status
  socket.on('user-online', async (id) => {
    onlineUsers[socket.id] = { id, socketId: socket.id };
    await User.updateOne(
      { _id: id },
      { online: true },
    );
    io.emit('online-users', Object.values(onlineUsers));
    console.log(`${id} is online ${JSON.stringify(onlineUsers)}`);
  });

  // Handle private messages
  socket.on('private-message', async ({ from, to, text }) => {
    const recipientSocket = Object.values(onlineUsers).find(user => user.id === to)?.socketId;
    
      const message = { from, to, text, timestamp: new Date() };
      if (recipientSocket) {
        io.to(recipientSocket).emit('private-message', message);
      }
      io.to(socket.id).emit('private-message', message);
      const savedMessage = new Message(message);
      await savedMessage.save();
    
  });

  // Handle user disconnect
  socket.on('logout', async () => {
    const id = onlineUsers[socket.id]?.id;
    if (id) {
      await User.updateOne(
        { _id: id  },
        { online: false }
      );
      delete onlineUsers[socket.id];
      io.emit('online-users', Object.values(onlineUsers));
      console.log('User disconnected:', id);
    }
  });
});

app.use(express.json())
app.use(cors());

app.post('/auth/signup', async(req, res) => {
    try{
        const {username, email, phoneNumber} = req.body
        const findUser = await User.findOne({$or:[ {email}, {username}, {phoneNumber}]});
        if(!findUser){
          const user = await User.create(
              {username, email, phoneNumber}
          );
          res.json({message: 'Logged in successfully', user});
        }else{
          res.json({message: 'Logged in successfully', user: findUser});
        }
        
    }catch(error){
        res.status(500).send(error.message);
    }
})

// API endpoint to fetch messages for a specific user
app.get('/messages/:from/:to', async (req, res) => {
  const { from, to } = req.params;
  try {
    const messages = await Message.find({$or:[ {'from':from, to: to}, {to:from, from: to}]});
    res.json(messages);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get('/users/:id', async(req, res) => {
  try {
    const { id } = req.params;
    const users = await User.find({}).lean().exec();
    let result = []
    for(let item of users){
      const messages = await Message.find({$or:[ {'from':id, to: item._id}, {to:item._id, from: id}]}).sort({timestamp: -1}).limit(1).exec();
      item.recentMessage = messages[0]
      result.push({...item, recentMessage:messages[0]?.text, timestamp: messages[0]?.timestamp})
    }
    console.log(result)
    res.json(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
})

server.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${process.env.PORT}`);
});
