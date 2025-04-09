import { TransactionEvent } from 'forta-agent'

import { logger } from '../../app'
import { RugpullDetector } from '../../detectors/RugpullDetector'
import { CreateTransactionEvent } from '../../helpers/forta'
import { DetectionRequest } from './dtos'

const rugpullDetector = new RugpullDetector()

export class RugPullDetectionService {
    static async detect(request: DetectionRequest) {
        logger.debug(`RugPull detection started for transaction ${request.hash}`)

        try {
            // Создаем TransactionEvent из DetectionRequest с помощью общей функции
            const transactionEvent = CreateTransactionEvent(request.trace)
            
            // Запускаем детектор Rug Pull
            return await rugpullDetector.handleTransaction(transactionEvent)
        } catch (error) {
            logger.error(`Error during RugPull detection: ${error}`)
            throw error
        }
    }
}
