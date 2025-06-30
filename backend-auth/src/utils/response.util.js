import { populate } from "dotenv";
import { StatusCodes } from "http-status-codes";

export const handleError = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    status: status,
    message: message,
  });
};

export const handleResponse = (
  res,
  { status = StatusCodes.OK, message = "Operation successfully !", data = null }
) => {
  return res.status(status).json({
    status: status || 200,
    message,
    data,
  });
};

export const handleResponseList = (
  res,
  {
    status = StatusCodes.OK,
    message = "Get list successfully!",
    data = [],
    pagination = {
      total: 0,
      page: 1,
      pageSize: 20,
      totalPages: 0,
    },
  }
) => {
  return res.status(status).json({
    status: status || 200,
    message,
    data,
    pagination,
  });
};

export const resultAndPagination = async (
  req,
  model,
  filter = {},
  options = {}
) => {
  const page = parseInt(req.query._page) || 1;
  const limit = parseInt(req.query._limit) || 20;
  const skip = (page - 1) * limit;

  const data = await model
    .find(filter)
    .populate(options.populate || [])
    .limit(limit)
    .skip(skip)
    .sort({
      createAt: -1,
    });

  const total = await model.countDocuments(filter);
  const totalPages = Math.ceil(total / limit);

  return {
    data: data,
    pagination: {
      total,
      page,
      pageSize: limit,
      totalPages,
    },
  };
};
