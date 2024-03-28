import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const cartsCollection = "Carts";

const cartsSchema = mongoose.Schema({
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Products"
        },
        quantity: {
            type: Number,
            required: true
        }
    }]
});

//Paginador
cartsSchema.plugin(mongoosePaginate);

const CartsModel = mongoose.model(cartsCollection, cartsSchema);

export default CartsModel;