export const errorHandler = (err, req, res, next) => {
    console.error(`Error message: ${err.message}`);
    console.error(`Request method: ${req.method}`);
    console.error(`Request URL: ${req.originalUrl}`);
    console.error(`Request body: ${JSON.stringify(req.body)}`);
    console.error(`Request query: ${JSON.stringify(req.query)}`);
    console.error(`Request params: ${JSON.stringify(req.params)}`);

    res.status(err.status || 500).json({
        error: {
            message: err.message,
            status: err.status,
        },
    });
}

