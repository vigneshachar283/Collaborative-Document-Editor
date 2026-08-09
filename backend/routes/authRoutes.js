const express= require("express");
const router =express.Router();

const {registeruser,loginUser}=require("./../controllers/authcontroller");
const validate = require("./../middleware/validate");
const { registerSchema } = require("./../validations/authvalidations");
const { loginSchema } = require("./../validations/authvalidations");

router.post(
    "/register",
    validate(registerSchema),
    registeruser
);
router.post("/login",validate(loginSchema),loginUser);


module.exports=router;