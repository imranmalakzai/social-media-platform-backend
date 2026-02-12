export const pageNotFound = (err, req, res, next) => {
  res.status(404).send("<h1>Page Not Found 404</h1>");
};
