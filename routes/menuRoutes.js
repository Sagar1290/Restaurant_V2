import express from "express";
import {
  createMenuItem,
  deleteMenuItem,
  getAllMenuItems,
  getMenuItem,
  updateMenuItem,
} from "../api/menu.js";
import { adminAuthMiddleWare } from "../middleware.js";

const menuRouter = express.Router();

menuRouter.get("/get-menu", async (req, res) => {
  try {
    const result = await getAllMenuItems();

    if (result.success) {
      res.json({
        success: true,
        message: "Menu Items fetched successfully!",
        menuItems: result.menuItems,
      });
    } else {
      res.status(404).json({ success: false, message: result.message });
    }
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
});

menuRouter.get("/menu-item/:id", async (req, res) => {
  try {
    const params = req.params;
    const result = await getMenuItem(params["id"]);
    console.log(result)
    if (result.success) {
      res.json({
        success: true,
        message: "Menu Item fetched successfully!",
        menuItem: result.menuItem,
      });
    } else {
      res.status(404).json({ success: false, message: result.message });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
});

menuRouter.post("/create-item", adminAuthMiddleWare, async (req, res) => {
  try {
    const body = req.body
    const itemDetail = body["itemDetail"]
    const result = await createMenuItem(itemDetail)

    if (result.success) {
      res.json({
        success: true,
        message: "Menu Item Added successfully!",
      });
    } else {
      res.status(404).json({ success: false, message: result.message });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
});

menuRouter.put("/update-item/:id", adminAuthMiddleWare, async (req, res) => {
  try {
    const id = req.params["id"]
    const { itemDetail } = req.body

    const result = await updateMenuItem(id, itemDetail);
    if (result.success) {
      res.json({
        success: true,
        message: "Menu Item Updated successfully!",
        menuItems: result.menuItems
      });
    } else {
      res.status(404).json({ success: false, message: result.message });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
});
menuRouter.delete("/delete-item/:id", adminAuthMiddleWare, async (req, res) => {
  try {
    const id = req.params["id"]
    const result = await deleteMenuItem(id);
    if (result.success) {
      res.json({
        success: true,
        message: "Menu Item Updated successfully!",
      });
    } else {
      res.status(404).json({ success: false, message: result.message });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
});

export { menuRouter };
