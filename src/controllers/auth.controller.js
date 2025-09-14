import * as AuthService from "../services/auth.service.js";

export const signupUser = async (req, res, next) => {
  try {
    const result = await AuthService.signupUser(req.body);
    res.json(result);
  } catch (err) { next(err); }
};

export const signupDept = async (req, res, next) => {
  try {
    const result = await AuthService.signupDepartment(req.body, req.user.id);
    res.json(result);
  } catch (err) { next(err); }
};

export const signupAdmin = async (req, res, next) => {
  try {
    const result = await AuthService.signupAdmin(req.body);
    res.json(result);
  } catch (err) { next(err); }
};

export const loginUser = async (req, res, next) => {
  try {
    const result = await AuthService.login(req.body, "USER");
    res.json(result);
  } catch (err) { next(err); }
};

export const loginDept = async (req, res, next) => {
  try {
    const result = await AuthService.login(req.body, "DEPARTMENT");
    res.json(result);
  } catch (err) { next(err); }
};

export const loginAdmin = async (req, res, next) => {
  try {
    const result = await AuthService.login(req.body, "ADMIN");
    res.json(result);
  } catch (err) { next(err); }
};
