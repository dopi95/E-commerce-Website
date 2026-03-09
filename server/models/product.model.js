import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name : {
        type : String,
        index: true
    },
    image : {
        type : Array,
        default : []
    },
    category : [
        {
            type : mongoose.Schema.ObjectId,
            ref : 'category',
            index: true
        }
    ],
    subCategory : [
        {
            type : mongoose.Schema.ObjectId,
            ref : 'subCategory',
            index: true
        }
    ],
    unit : {
        type : String,
        default : ""
    },
    stock : {
        type : Number,
        default : null
    },
    price : {
        type : Number,
        defualt : null,
        index: true
    },
    discount : {
        type : Number,
        default : null
    },
    description : {
        type : String,
        default : ""
    },
    more_details : {
        type : Object,
        default : {}
    },
    publish : {
        type : Boolean,
        default : true,
        index: true
    }
},{
    timestamps : true
})

productSchema.index({ name: "text", description: 'text' }, { weights: { name: 10, description: 5 } });
productSchema.index({ createdAt: -1 });
productSchema.index({ price: 1, discount: -1 });

const ProductModel = mongoose.model('product',productSchema)

export default ProductModel