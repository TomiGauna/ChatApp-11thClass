import express from "express";
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
/* import productsRouter from './routes/productsRouter.js';
import cartsRouter from './routes/cartsRouter.js'; */
import viewsRouter from './routes/viewsRouter.js';
import { Server } from "socket.io";

const app = express();
const listeningPort = 8080;

const serverHttp = app.listen(listeningPort, () => console.log(`Hearing on port ${listeningPort}`)); 
const io = new Server(serverHttp);

app.engine('handlebars', handlebars.engine());

app.set('views', __dirname+'/views');
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended:true }))
app.use(express.static(__dirname+'/public'));

/* app.use('/api/products/', productsRouter); 
app.use('/api/carts/', cartsRouter); */
app.use('/', viewsRouter);

const messages = [];

io.on('connection', (socket) => {
    console.log('New client connected')

    socket.on('msg', (data) => {
        /* console.log(data); */
        messages.push(data);
        io.emit('uploadingMessages', messages)
    })

    socket.on('authenticated', data => {
       socket.broadcast.emit('newUserConnected', data);
       /* console.log('Server: ', data) */
    })
})

