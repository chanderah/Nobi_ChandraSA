const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {validationResult} = require('express-validator');
const conn = require('../../dbConnection').promise();
var moment = require('moment');

exports.transaction = async (req,res,next) =>{
    const errors = validationResult(req);
    const header = req.headers;

    if(!("token" in header)){
        return res.status(422).json({ errors: "Unauthorized" });
    }else{
        if(header.token != theToken){
            return res.status(422).json({ errors: "Wrong token" });
        }
    }

    if(!errors.isEmpty()){
        return res.status(422).json({ errors: errors.array() });
    }

    if(req.body.amount <= 0.00000001){
        return res.status(201).json({
            trx_id:"",
            amount:"",
            message:"Input amount greater than 0.00000001"
        });
    }

    try{
        const [row] = await conn.execute(
            "SELECT `amount_available` FROM `balance` WHERE `user_id`=?",
            [req.body.user_id]
          );

        if (row.length === 0) {
            return res.status(422).json({
              message: "User not found in data balance",
          });
        }

        for(let r of row) {
            if(r.amount_available < req.body.amount){
                    return res.status(201).json({
                        trx_id:"",
                        amount:"",
                        message:"Your amount request is bigger than amount available"
                    });
            } else{
                const [rows2] = await conn.execute(
                    "SELECT `id` FROM `transaction` WHERE `trx_id`=?",
                    [req.body.trx_id]
                );
                if (rows2.length > 0) {
                    return res.status(201).json({
                        trx_id:"",
                        amount:"",
                        message:"trx_id has already exist"
                    });
                }
                const timestamp = moment().format('YYYY-MM-DD hh:mm:ss');
                const [rows3] = await conn.execute('INSERT INTO `transaction` (`trx_id`, `user_id`, `amount`, `created_at`, `updated_at`) VALUES(?,?,?,?,?)',[
                    req.body.trx_id,
                    req.body.user_id,
                    req.body.amount,
                    timestamp,
                    timestamp
                ]);
        
                if (rows3.affectedRows === 1) {
                    await sleep(30000);
                    const amount = r.amount_available - req.body.amount;
                    const [rows4] = await conn.execute('UPDATE `balance` SET `amount_available`="'+amount+'",`updated_at`="'+timestamp+'" WHERE user_id = "'+req.body.user_id+'"');
                    if (rows4.affectedRows === 1) {
                        return res.status(202).json({
                            trx_id:req.body.trx_id,
                            amount:amount.toFixed(6).toString(),
                            message:"Success"
                        });
                    }
                }
            }
        }

    }
    catch(err){
        next(err);
    }
}

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }