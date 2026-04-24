import { Request, Response } from "express";
import { processBfhl } from "../services/bfhl_service";

/**
 * Controller for POST /api/bfhl
 * Handles request validation and delegates processing to the service layer.
 */
export const bfhl_controller = (req: Request, res: Response) => {
  const { nodes } = req.body;

  // Ensure 'nodes' is a valid array
  if (!nodes || !Array.isArray(nodes)) {
    return res.status(400).json({
      is_success: false,
      error: "The 'nodes' field is required and must be an array of strings.",
    });
  }

  try {
    const result = processBfhl(nodes);
    return res.json(result);
  } catch (err) {
    console.error("BFHL Controller Error:", err);
    return res.status(500).json({
      is_success: false,
      error: "An internal error occurred while processing the graph.",
    });
  }
};
