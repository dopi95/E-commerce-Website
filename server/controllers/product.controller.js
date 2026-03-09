import ProductModel from "../models/product.model.js";
import { getCache, setCache, clearCache } from "../utils/cache.js";
import { sampleProducts } from "../data/sampleProducts.js";

export const createProductController = async(request,response)=>{
    try {
        const { 
            name ,
            image ,
            category,
            subCategory,
            unit,
            stock,
            price,
            discount,
            description,
            more_details,
        } = request.body 

        if(!name || !image[0] || !category[0] || !subCategory[0] || !unit || !price || !description ){
            return response.status(400).json({
                message : "Enter required fields",
                error : true,
                success : false
            })
        }

        const product = new ProductModel({
            name ,
            image ,
            category,
            subCategory,
            unit,
            stock,
            price,
            discount,
            description,
            more_details,
        })
        const saveProduct = await product.save()
        clearCache();

        return response.json({
            message : "Product Created Successfully",
            data : saveProduct,
            error : false,
            success : true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export const getProductController = async(request,response)=>{
    try {
        let { page, limit, search } = request.body 

        if(!page) page = 1
        if(!limit) limit = 10

        const cacheKey = `products_${page}_${limit}_${search || 'all'}`;
        const cached = getCache(cacheKey);
        
        if (cached) {
            return response.json(cached);
        }

        const query = search ? { $text : { $search : search } } : {};
        const skip = (page - 1) * limit;

        const [data, totalCount] = await Promise.all([
            ProductModel.find(query)
                .select('name image price discount unit stock description')
                .sort({createdAt : -1})
                .skip(skip)
                .limit(limit)
                .populate('category', 'name')
                .populate('subCategory', 'name')
                .lean(),
            ProductModel.countDocuments(query)
        ]);

        const result = {
            message : "Product data",
            error : false,
            success : true,
            totalCount,
            totalNoPage : Math.ceil(totalCount / limit),
            data
        };

        setCache(cacheKey, result);
        return response.json(result);
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export const getProductByCategory = async(request,response)=>{
    try {
        const { id } = request.body 

        if(!id){
            return response.status(400).json({
                message : "provide category id",
                error : true,
                success : false
            })
        }

        const cacheKey = `category_${id}`;
        const cached = getCache(cacheKey);
        if (cached) return response.json(cached);

        const product = await ProductModel.find({ category : { $in : id } })
            .select('name image price discount unit stock')
            .limit(15)
            .lean();

        const result = {
            message : "category product list",
            data : product,
            error : false,
            success : true
        };

        setCache(cacheKey, result);
        return response.json(result);
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export const getProductByCategoryAndSubCategory  = async(request,response)=>{
    try {
        let { categoryId,subCategoryId,page,limit } = request.body

        if(!categoryId || !subCategoryId){
            return response.status(400).json({
                message : "Provide categoryId and subCategoryId",
                error : true,
                success : false
            })
        }

        if(!page) page = 1
        if(!limit) limit = 10

        const cacheKey = `cat_sub_${categoryId}_${subCategoryId}_${page}_${limit}`;
        const cached = getCache(cacheKey);
        if (cached) return response.json(cached);

        const query = {
            category : { $in :categoryId  },
            subCategory : { $in : subCategoryId }
        };

        const skip = (page - 1) * limit;

        const [data,dataCount] = await Promise.all([
            ProductModel.find(query)
                .select('name image price discount unit stock')
                .sort({createdAt : -1})
                .skip(skip)
                .limit(limit)
                .lean(),
            ProductModel.countDocuments(query)
        ]);

        const result = {
            message : "Product list",
            data,
            totalCount : dataCount,
            page,
            limit,
            success : true,
            error : false
        };

        setCache(cacheKey, result);
        return response.json(result);

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export const getProductDetails = async(request,response)=>{
    try {
        const { productId } = request.body 

        const product = await ProductModel.findOne({ _id : productId })


        return response.json({
            message : "product details",
            data : product,
            error : false,
            success : true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//update product
export const updateProductDetails = async(request,response)=>{
    try {
        const { _id } = request.body 

        if(!_id){
            return response.status(400).json({
                message : "provide product _id",
                error : true,
                success : false
            })
        }

        const updateProduct = await ProductModel.updateOne({ _id : _id },{
            ...request.body
        })
        clearCache();

        return response.json({
            message : "updated successfully",
            data : updateProduct,
            error : false,
            success : true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//delete product
export const deleteProductDetails = async(request,response)=>{
    try {
        const { _id } = request.body 

        if(!_id){
            return response.status(400).json({
                message : "provide _id ",
                error : true,
                success : false
            })
        }

        const deleteProduct = await ProductModel.deleteOne({_id : _id })
        clearCache();

        return response.json({
            message : "Delete successfully",
            error : false,
            success : true,
            data : deleteProduct
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//search product
export const searchProduct = async(request,response)=>{
    try {
        let { search, page , limit } = request.body 

        if(!page) page = 1
        if(!limit) limit = 10

        const cacheKey = `search_${search}_${page}_${limit}`;
        const cached = getCache(cacheKey);
        if (cached) return response.json(cached);

        const query = search ? { $text : { $search : search } } : {};
        const skip = (page - 1) * limit;

        const [data,dataCount] = await Promise.all([
            ProductModel.find(query)
                .select('name image price discount unit stock description')
                .sort({ createdAt : -1 })
                .skip(skip)
                .limit(limit)
                .populate('category', 'name')
                .populate('subCategory', 'name')
                .lean(),
            ProductModel.countDocuments(query)
        ]);

        const result = {
            message : "Product data",
            error : false,
            success : true,
            data,
            totalCount :dataCount,
            totalPage : Math.ceil(dataCount/limit),
            page,
            limit 
        };

        setCache(cacheKey, result);
        return response.json(result);

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}