import express, { RequestHandler } from "express";
import {structureDoc} from '../controllers/aiController'

const router = express.Router();

router.post('/structure-doc',structureDoc as unknown as RequestHandler);

export default router