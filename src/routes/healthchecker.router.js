import { Router } from "express";

import { healthCheck } from "../controllers/healthchecker.controller";

const router = Router();

router.route('/').get(healthCheck)
export default router