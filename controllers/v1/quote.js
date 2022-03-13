const jwt = require('jsonwebtoken');
const conn = require('../../dbConnection').promise();
const axios = require('axios');

exports.getQuote = async (req,res,next) => {

    try{
        const source = 'https://catfact.ninja/fact';
        const getBreeds = await axios.get(source);

        res.json({
            quote:getBreeds.data.fact,
            status:"success",
            source:source,
        });
        
    }
    catch(err){
        next(err);
    }
}