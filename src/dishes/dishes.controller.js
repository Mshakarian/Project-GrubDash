const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass
function dishExists(req, res, next) {
  const { dishId } = req.params;
  const foundDish = dishes.find((dish) => dish.id === dishId);
  if (foundDish) {
    res.locals.dish = foundDish;
    return next();
  }
  next({
    status: 404,
    message: `Dish id not found: ${dishId}.`,
  });
}

function hasName(req, res, next) {
  const dish = req.body.data;
  if (dish.name === undefined) {
    return next({ status: 400, message: "Dish must include a name" });
  } else if (dish.name === "") {
    return next({ status: 400, message: "Dish must include a name" });
  }
  next();
}

function hasDescription(req, res, next) {
  const dish = req.body.data;
  if (dish.description === undefined) {
    return next({ status: 400, message: "Dish must include a description" });
  } else if (dish.description === "") {
    return next({ status: 400, message: "Dish must include a description" });
  }
  next();
}

function hasPrice(req, res, next) {
  const dish = req.body.data;
  if (dish.price === undefined) {
    return next({ status: 400, message: "Dish must include a price" });
  } else if (dish.price === "") {
    return next({ status: 400, message: "Dish must include a price" });
  } else if (dish.price <= 0) {
    return next({
      status: 400,
      message: "Dish must have a price that is an integer greater than 0",
    });
  } else if (typeof dish.price !== "number") {
    return next({
      status: 400,
      message: "Dish must have a price that is a number",
    });
  }
  next();
}

function hasImgUrl(req, res, next) {
  const dish = req.body.data;
  if (dish.image_url === undefined) {
    return next({ status: 400, message: "Dish must include a image_url" });
  } else if (dish.image_url === "") {
    return next({ status: 400, message: "Dish must include a image_url" });
  }
  next();
}

function read(req, res, next) {
  res.json({ data: res.locals.dish });
}

function list(req, res, next) {
  res.json({ data: dishes });
}

function create(req, res) {
  const dish = req.body.data;
  dish.id = nextId();
  dishes.push(dish);
  res.status(201).json({ data: dish });
}

function update(req, res, next) {
  let foundDish = res.locals.dish;
  let dish = req.body.data;
  if (dish.id && foundDish.id !== dish.id) {
    return next({
      status: 400,
      message: `Dish id does not match route id. Dish: ${dish.id}, Route: ${foundDish.id}`,
    });
  } else if (dish.id === undefined) {
    dish.id = foundDish.id;
  } else if (dish.id === null) {
    dish.id = foundDish.id;
  } else if (dish.id === "") {
    dish.id = foundDish.id;
  }
  foundDish = dish;
  res.status(200).json({ data: foundDish });
}

module.exports = {
  create: [hasName, hasDescription, hasPrice, hasImgUrl, create],
  list,
  read: [dishExists, read],
  update: [dishExists, hasName, hasDescription, hasPrice, hasImgUrl, update],
};
