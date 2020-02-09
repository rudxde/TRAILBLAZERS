import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    const logedInUserId = (req as any).authorizationToken;
});
router.post('/:id', (req, res) => {
    const logedInUserId = (req as any).authorizationToken;
});
router.delete('/:id', (req, res) => {
    const logedInUserId = (req as any).authorizationToken;
});

export default router;
