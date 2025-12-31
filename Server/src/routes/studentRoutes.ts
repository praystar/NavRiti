import { Router } from 'express';
import {
  submitStage1,
  submitStage2,
  submitStudentProfileWithCV,
  upload
} from '../controllers/studentController';

const router = Router();

router.post('/stage1', submitStage1);
router.post('/stage2', submitStage2);
router.post('/profile-cv', upload.single('cv'), submitStudentProfileWithCV);

export default router;