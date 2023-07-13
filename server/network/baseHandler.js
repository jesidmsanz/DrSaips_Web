function baseHandler() {
    return (req, res, next) => {
      try {
        next();
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    };
  }
  
  module.exports = baseHandler;
  
