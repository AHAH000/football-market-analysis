const sortingMiddleware = (req, res, next) => {
    const { sort = "desc" } = req.query;

    // Determine the sorting order: 1 for ascending, -1 for descending
    const sortOrder = sort === "asc" ? 1 : -1;

    if (req.players) {
        // Sort the players if they already exist from the search middleware
        req.players = req.players.sort((a, b) => {
            if (sortOrder === 1) {
                return a.market_value_in_eur - b.market_value_in_eur;
            } else {
                return b.market_value_in_eur - a.market_value_in_eur;
            }
        });
    }

    next(); // Pass control to the next middleware or route
};

module.exports = sortingMiddleware;
