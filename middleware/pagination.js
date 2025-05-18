const paginateResults = (req, res, next) => {
    const { page = 1, limit = 10, sort = 'createdAt' } = req.query;
  
    const pagination = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      skip: (parseInt(page, 10) - 1) * parseInt(limit, 10),
      sortBy: sort,
    };
  
    req.pagination = pagination; // Attach pagination info to request
    next();
  };
  
export default paginateResults;
  