import { Router } from "express";
import { bfhl_controller } from "../../controllers/bfhl_controller";

const router = Router();

/**
 * BFHL API Routes
 * Mounted at /api/bfhl
 */

// Main analysis endpoint
router.post("/", bfhl_controller);

export default router;
