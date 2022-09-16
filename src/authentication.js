const fs = require('fs');

function readFileSync() {
  var data;
  try {
    data = fs.readFileSync(module.exports.options.file, "utf8");
  } catch (err) {
    return { action: "readFileSync", err: err.message };
  }
  return { action: "readFileSync", data };
}

function config(options) {
  return new Promise((resolve, reject) => {
    if (!options || Object.keys(options) === 0) return resolve({ action: "config", err: "No options were given" });
    if (!Object.keys(options).includes("options") || !options.options || typeof options.options !== "object") return resolve({ action: "config", err: "Invalid options" });
    module.exports.options = options.options;
    return resolve({ action: "config", options: options.options });
  });
}

function createUser(options) {
  return new Promise((resolve, reject) => {
    if (!options || Object.keys(options).length === 0) return resolve({ action: "createUser", err: "No options were given" });
    if (!Object.keys(options).includes("username") || !options.username) return resolve({ action: "createUser", err: "No username was given" });
    if (!Object.keys(options).includes("password") || !options.password) return resolve({ action: "createUser", err: "No password was given" });
    if (readFileSync().data[options.username].password !== options.password) return resolve({ action: "createUser", err: "Invalid password" });
    if (Object.keys(options).includes("data") && options.data && (typeof options.data !== "object")) return resolve({ action: "createUser", err: "Invalid data" });
    fs.writeFile(module.exports.options.file, JSON.stringify({
      ...readFileSync().data,
      ...{
        [options.username]: {
          password: options.password,
          data: options.data || {}
        }
      }
    }), 'utf8', (err) => {
      if (err) return resolve({ action: "createUser", err: err.message });
      return resolve({ action: "createUser", username: options.username, password: options.password, data: options.data || {} });
    });
  });
}

function createUserSync(options) {
  if (!options || Object.keys(options).length === 0) return { action: "createUserSync", err: "No options were given" };
  if (!Object.keys(options).includes("username") || !options.username) return { action: "createUserSync", err: "No username was given" };
  if (!Object.keys(options).includes("password") || !options.password) return { action: "createUserSync", err: "No password was given" };
  if (readFileSync().data[options.username].password !== options.password) return { action: "createUserSync", err: "Invalid password" };
  if (Object.keys(options).includes("data") && options.data && (typeof options.data !== "object")) return { action: "createUserSync", err: "Invalid data" };
  try {
    fs.writeFileSync(module.exports.options.file, JSON.stringify({
      ...readFileSync().data,
      ...{
        [options.username]: {
          password: options.password,
          data: options.data || {}
        }
      }
    }), 'utf8');
  } catch (err) {
    return { action: "createUserSync", err: err.message };
  }
  return { action: "createUserSync", username: options.username, password: options.password, data: options.data || {} };
}

function editUser(options) {
  return new Promise((resolve, reject) => {
    if (!options || Object.keys(options).length === 0) return resolve({ action: "editUser", err: "No options were given" });
    if (!Object.keys(options).includes("username") || !options.username) return resolve({ action: "editUser", errr: "No username was given" });
    if (!Object.keys(readFileSync().data).includes(options.username)) return resolve({ action: "editUser", err: "Invalid username" });
    if (!Object.keys(options).includes("password") || !options.password) return resolve({ action: "editUser", err: "No password was given" });
    if (readFileSync().data[options.username].password !== options.password) return resolve({ action: "editUser", err: "Invalid password" });
    if (!Object.keys(options).includes("options") || !options.options) return resolve({ action: "editUser", err: "No new options was given" });
    fs.writeFile(module.exports.options.file, JSON.stringify({
      ...readFileSync().data,
      ...{
        [options?.options?.username || options.username]: {
          password: options?.options?.password || readFileSync().data[options.username].password,
          data: options?.options?.data || readFileSync().data[options.username] || {}
        }
      }
    }), 'utf8', (err) => {
      if (err) return resolve({ action: "editUser", err: err.message });
      return resolve({ action: "editUser", oldUsername: options.username, options: options.options });
    });
  });
}

function editUserSync(userId, options, extraOptions) {
  if (!options || Object.keys(options).length === 0) return { action: "editUserSync", err: "No options were given" };
  if (!Object.keys(options).includes("username") || !options.username) return { action: "editUserSync", errr: "No username was given" };
  if (!Object.keys(readFileSync().data).includes(options.username)) return { action: "editUserSync", err: "Invalid username" };
  if (!Object.keys(options).includes("password") || !options.password) return { action: "editUserSync", err: "No password was given" };
  if (readFileSync().data[options.username].password !== options.password) return { action: "editUserSync", err: "Invalid password" };
  if (!Object.keys(options).includes("options") || !options.options) return { action: "editUserSync", err: "No new options was given" };
  try {
    fs.writeFileSync(module.exports.options.file, JSON.stringify({
      ...readFileSync().data,
      ...{
        [options?.options?.username || options.username]: {
          password: options?.options?.password || readFileSync().data[options.username].password,
          data: options?.options?.data || readFileSync().data[options.username] || {}
        }
      }
    }), 'utf8');
  } catch (err) {
    return { action: "editUserSync", err: err.message };
  }
  return { action: "editUserSync", oldUsername: options.username, options: options.options };
}

function deleteUser(options) {
  return new Promise((resolve, reject) => {
    if (!options || Object.keys(options).length === 0) return resolve({ action: "deleteUser", err: "No options were given" });
    if (!Object.keys(options).includes("username") || !options.username) return resolve({ action: "deleteUser", errr: "No username was given" });
    if (!Object.keys(readFileSync().data).includes(options.username)) return resolve({ action: "deleteUser", err: "Invalid username" });
    if (!Object.keys(options).includes("password") || !options.password) return resolve({ action: "deleteUser", err: "No password was given" });
    if (readFileSync().data[options.username].password !== options.password) return resolve({ action: "deleteUser", err: "Invalid password" });
    fs.writeFile(module.exports.options.file, JSON.stringify(Object.entries(readFileSync().data).filter((user) => user[0] !== options.username).reduce((data, user) => ({ ...data, [user[0]]: user[1] }), {})), 'utf8', (err) => {
      if (err) return resolve({ action: "deleteUser", err: err.message });
      return resolve({ action: "deleteUser", username: options.username });
    });
  });
}

function deleteUserSync(userId, options, extraOptions) {
  if (!options || Object.keys(options).length === 0) return { action: "deleteUserSync", err: "No options were given" };
  if (!Object.keys(options).includes("username") || !options.username) return { action: "deleteUserSync", errr: "No username was given" };
  if (!Object.keys(readFileSync().data).includes(options.username)) return { action: "deleteUserSync", err: "Invalid username" };
  if (!Object.keys(options).includes("password") || !options.password) return { action: "deleteUserSync", err: "No password was given" };
  if (readFileSync().data[options.username].password !== options.password) return { action: "deleteUserSync", err: "Invalid password" };
  try {
    fs.writeFileSync(module.exports.options.file, JSON.stringify(Object.entries(readFileSync().data).filter((user) => user[0] !== options.username).reduce((data, user) => ({ ...data, [user[0]]: user[1] }), {})), 'utf8');
  } catch (err) {
    return { action: "deleteUserSync", err: err.message };
  }
  return { action: "deleteUserSync", username: options.username };
}

function getUser(userId, options, extraOptions) {
  return new Promise((resolve, reject) => {
    if (!options || Object.keys(options).length === 0) return resolve({ action: "getUser", err: "No options were given" });
    if (!Object.keys(options).includes("username") || !options.username) return resolve({ action: "getUser", errr: "No username was given" });
    if (!Object.keys(readFileSync().data).includes(options.username)) return resolve({ action: "getUser", err: "Invalid username" });
    return resolve({ action: "getUser", username: options.username, data: readFileSync().data[options.username].data });
  });
}

function getUserSync(userId, options, extraOptions) {
  if (!options || Object.keys(options).length === 0) return { action: "getUserSync", err: "No options were given" };
  if (!Object.keys(options).includes("username") || !options.username) return { action: "getUserSync", errr: "No username was given" };
  if (!Object.keys(readFileSync().data).includes(options.username)) return { action: "getUserSync", err: "Invalid username" };
  return { action: "getUserSync", username: options.username, data: readFileSync().data[options.username].data };
}

function loop(body, options, res) {
  Object.entries(options || {}).forEach((item) => {
    if (typeof item[1] === "object") {
        loop(body[item[0]], res, options[item[0]]);
    } else {
      if (body[item[0]] !== item[1]) return res.send({ action: "authentication", err: "Invalid key" });
    }
  });
}

function authentication(options) {
  return function (req, res, next) {
    if (!Object.keys(req.body[module.exports.options.storage]).includes("username") || !req.body[module.exports.options.storage].username) return res.send({ action: "authentication", err: "No username was given" });
    if (!Object.keys(readFileSync().data).includes(req.body[module.exports.options.storage].username)) return res.send({ action: "authentication", err: "Invalid username" });
    if (!Object.keys(req.body[module.exports.options.storage]).includes("password")) return res.send({ action: "authentication", err: "No password was given" });
    if (readFileSync().data[req.body[module.exports.options.storage].username].password !== req.body[module.exports.options.storage].password) return res.send({ action: "authentication", err: "Invalid password" });
    loop(readFileSync().data[req.body[module.exports.options.storage].username], options, res);
    next();
  }
}

module.exports = {
  authentication,
  createUser,
  editUser,
  deleteUser,
  createUserSync,
  editUserSync,
  deleteUserSync
}
