import { plainToInstance } from 'class-transformer'
import { Request, Response } from 'express'

import { logger } from '../../../app'
import { ErrorHandler, validateRequest } from '../../../helpers'
import { DetectionRequest, toDetectionResponse, DetectionResponse } from '../dtos'
import { RugPullDetectionService } from '../service-rugpull'
import { PublicClassFields } from '../../../types'

export const detectRugPull = async (
    req: Request<Record<string, string>, PublicClassFields<DetectionRequest>>,
    res: Response,
) => {
    const request = plainToInstance(DetectionRequest, req.body)

    logger.debug(`rugpull detect request started. Request id: ${request.id}`)

    try {
        // validate request
        await validateRequest(request)

        // perform business logic for rugpull detection
        const findings = await RugPullDetectionService.detect(request)

        logger.debug('rugpull detect request finished successfully')

        // Преобразуем результаты детектора в формат DetectionResponse
        const detectionResponse = new DetectionResponse({
            request,
            detectionInfo: {
                detected: findings.length > 0,
                additionalData: { findings }
            }
        })

        // return response
        res.json(toDetectionResponse(detectionResponse))
    } catch (error) {
        // handle errors
        ErrorHandler.processApiError(res, error)
    }
}
