const validate = (schema) => {

    return (req, res, next) => {

        const result = schema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                message: "Invalid input"
            });
        }

        next();
    };
};

module.exports = validate