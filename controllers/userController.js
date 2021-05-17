import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const users = JSON.parse(
  readFileSync(
    `${__dirname}/../dev-data/data/users.json`
  )
);

/*
    ROUTE HANDLERS (Controllers)
    Handles request to the (user) endpoint and returns a response to the client
*/
const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'route not defined',
  });
};

const getUser = (req, res) => {
  const id = req.params.id * 1;
  const user = users.find((el) => el.id === id);

  if (!user) {
    return res.status(404).json({
      status: 'failed',
      message: 'Invalid ID',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'route not defined',
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'route not defined',
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'route not defined',
  });
};

export {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
