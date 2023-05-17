import express from 'express';
import {body} from 'express-validator';
import { validate } from '../middleware/validator.js';
import * as authjController from '../controller/auth.js'
import { isAuth } from '../middleware/auth.js';

const router = express.Router();
const validateCredential =[
    body('username')
        .trim()
        .notEmpty()
        .isLength({min:5})
        .withMessage("아이디는 최소 4자입력"),
    body('password')
        .trim()
        .isLength({min:4})
        .withMessage("비밀번호는 최소 4자이상 입력하세요"),
    validate
]
const validateSignup = [
    // 위에것 복사해오기
    ...validateCredential,
    body('name').notEmpty().withMessage("이름을 꼭입력하세용"),
    body('email').isEmail().normalizeEmail().withMessage("이메일 형식을 지켜주세요"),
    body('url').isURL().withMessage("Url을 입력하세요")
    // 비어도됨, checkFalsy -> falsy로 된 값은 true 나머지는 전부 false로 처리함
    .optional({nullable: true, checkFalsy: true}),
    validate
]
router.post('/signup',validateSignup, authjController.signup)
router.post('/login',validateCredential, authjController.login)
router.get('/me', isAuth, authjController.me)
export default router;