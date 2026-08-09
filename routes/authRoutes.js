const express= require("express");
const router =express.Router();

const {registeruser,loginUser}=require("./../controllers/authController");
const validate = require("./../middleware/validate");
const { registerSchema } = require("../validations/authValidation");
const { loginSchema } = require("../validations/authValidation");

router.post(
    "/register",
    validate(registerSchema),
    registeruser
);
router.post("/login",validate(loginSchema),loginUser);


module.exports=router;