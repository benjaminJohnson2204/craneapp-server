const { Category } = require("../models/category");

const findCategoryByName = async (categoryName) => {
    try {
        let category = await Category.findOne({name : categoryName}).exec();
        return category;
    } catch (error) {
        console.error(error.message);
        return false;
    }
};

const findCategoryById = async (id) => {
    try {
        let category = await Category.findById(id).exec();
        return category;
    } catch (error) {
        console.error(error.message);
        return false;
    }
};

const addCategory = async (categoryName) => {
    try {
        let category = new Category({ name : categoryName });
        await category.save();
        return category;
    } catch (error) {
        console.error(error.message);
        return false;
    }
};

const getAllCategories = async () => {
    try {
        let categories = await Category.find().exec();
        return categories;
    } catch (error) {
        console.error(error.message);
        return false;
    }
};


module.exports = {
    findCategoryByName,
    findCategoryById,
    addCategory,
    getAllCategories
};