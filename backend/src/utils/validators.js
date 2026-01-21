import Joi from 'joi';

// Ticker validation
export const tickerSchema = Joi.object({
  ticker: Joi.string()
    .uppercase()
    .pattern(/^[A-Z]{1,5}$/)
    .required()
    .messages({
      'string.pattern.base': 'Ticker must be 1-5 uppercase letters',
      'any.required': 'Ticker is required',
    }),
});

// Watchlist validation
export const watchlistSchema = Joi.object({
  name: Joi.string().min(1).max(50).required(),
  stocks: Joi.array().items(
    Joi.object({
      ticker: Joi.string().uppercase().required(),
      notes: Joi.string().max(200).allow(''),
    })
  ),
});

// Add stock to watchlist
export const addStockSchema = Joi.object({
  ticker: Joi.string().uppercase().required(),
  notes: Joi.string().max(200).allow(''),
});

// Forecast parameters
export const forecastSchema = Joi.object({
  days: Joi.number().integer().min(5).max(120).default(60),
  simulations: Joi.number().integer().min(100).max(10000).default(2000),
  include_paths: Joi.boolean().default(false),
});

// Short-term prediction
export const shortTermSchema = Joi.object({
  days: Joi.number().integer().min(1).max(10).default(5),
});

// History parameters
export const historySchema = Joi.object({
  days_back: Joi.number().integer().min(10).max(750).default(60),
});

// Agent query
export const agentQuerySchema = Joi.object({
  query: Joi.string().min(1).max(1000).required(),
  thread_id: Joi.string().max(100).default('default_thread'),
});

// Search query
export const searchSchema = Joi.object({
  q: Joi.string().min(1).max(100).required(),
});

// Validate function
export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors,
      });
    }

    req.validatedData = value;
    next();
  };
};

// Validate query params
export const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors,
      });
    }

    req.validatedQuery = value;
    next();
  };
};
