const Workspace = require("../models/workspaceModel");

const createWorkspace = async (req, res) => {
  try {
    const {
      name,
      type,
      location,
      capacity,
      amenities,
      status,
      description,
      isActive,
    } = req.body;
    const newWorkspace = new Workspace({
      name,
      type,
      location,
      capacity,
      amenities,
      status,
      description,
      isActive,
    });
    console.log("this is workspace", newWorkspace);
    await newWorkspace.save();
    res.status(200).json({
      workspace: newWorkspace,
    });
  } catch (error) {
    console.log(error);
  }
};

const getAllWorkspaces = async (req, res) => {
  try {
    const allWorkspaces = await Workspace.find();
    res.status(200).json({
      success: true,
      workspaces: allWorkspaces,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { createWorkspace, getAllWorkspaces };
