import { Router } from 'express'

import * as DetectionController from './controller'

const detectionRouter = Router()

detectionRouter.post('/', DetectionController.detect)
detectionRouter.post('/rugpull', DetectionController.detectRugPull)

export { detectionRouter }
