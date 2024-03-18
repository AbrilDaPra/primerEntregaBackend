// import Students from './models/students.model';

export default(io) => {
    io.on('connection', (socket) => {
        console.log('New user connected');
    })
}