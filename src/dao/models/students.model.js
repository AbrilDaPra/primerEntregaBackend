// import mongoose from 'mongoose';
import { Schema, model } from 'mongoose';

// const { Schema } = mongoose;

//Nombre de la colección en la BD
const collection = "Estudiantes";

const userSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    lastname: {
        type: String,
        require: true
    },
    age: {
        type: Number,
        require: true
    },
    dni: {
        type: Number,
        require: true,
        unique: true
    },
    subject: {
        type: String,
        require: true
    },
    calification: {
        type: Number,
        require: true
    }
})

// const studentsModel = mongoose.model(collection, userSchema);

// export default studentsModel;
export default model('students.model', userSchema);