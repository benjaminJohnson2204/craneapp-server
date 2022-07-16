const { Option } = require("../models/option");


const findOptionById = async (id) => {
    try {
        let option = await Option.findById(id).exec();
        return option;
    } catch (error) {
        console.error(error.message);
        return false;
    }
};

const addOption = async (text, isCorrect) => {
    try {
        let option = new Option({
            text : text,
            isCorrect : isCorrect
        });
        await option.save();
        return option;
    } catch (error) {
        console.error(error.message);
        return false;
    }
};


module.exports = {
    findOptionById, addOption
};