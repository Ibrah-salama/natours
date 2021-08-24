const AppError = require('../util/AppError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token! please log in again.');


const handleJWTExpiredError = () =>
  new AppError('IYour token has expired! please log in again.');


const handleDublicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Dublication field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};


const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(', ')}`;
  return new AppError(message, 400);
};


const sendErrorDev = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    // RENDERED WEBSITE
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });
  }
};


const sendErrorProd = (err, req, res) => {
    // A) API 
  if (req.originalUrl.startsWith('/api')) {
    if(err.isOperational){
        return res.status(err.statusCode).json({
            status: err.status,
            message : err.message,
        })
        //programming or othe unknown error: don't leak error details
    }
        // 1) log error 
        console.error('ERROR ', err);
        //2)send generic message 
        return res.status(500).json({
            status:'error',
            message:'Somthing went very wrong'
        })
  }
      // B) RENDERED WEBSITE 
    if(err.isOperational){
        return res.status(err.statusCode).render('error', {
            title: 'Something went wrong!',
            msg: err.message,
          });
        //programming or othe unknown error: don't leak error details
    }
        // 1) log error 
        // console.error('ERROR ', err);
        //2)send generic message 
        return res.status(err.statusCode).render('error', {
            title: 'Something went wrong!',
            msg: 'Please Try again later '
          });
};
module.exports = (err, req, res, next) => {
  console.log(err.stack);
  console.log(err.statusCode);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else {
    let error = { ...err };
    error.message = err.message
    if (error.name == 'CastError') error = handleCastErrorDB(error);
    if (error.code == 11000) error = handleDublicateFieldsDB(error);
    if (err.name == 'ValidationError') error = handleValidationErrorDB(error);
    if (err.name == 'JsonWebTokenError') error = handleJWTError(error);
    if (err.name == 'TokenExpiredError') error = handleJWTExpiredError(error);

    sendErrorProd(error, req, res);
  }
};
