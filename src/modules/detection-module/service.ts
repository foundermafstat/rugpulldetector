import { RugpullDetector } from '../../detectors/RugpullDetector'
import { SuspiciousApprovalsDetector } from '../../detectors/SuspiciousApprovalsDetector'
import { CreateTransactionEvent } from '../../helpers/forta'
import { DetectionRequest, DetectionResponse } from './dtos'

/**
 * DetectionService
 *
 * Implements a `detect` method that receives an enriched view of an
 * EVM compatible transaction (i.e. `DetectionRequest`)
 * and returns a `DetectionResponse`
 *
 * API Reference:
 * https://github.com/ironblocks/venn-custom-detection/blob/master/docs/requests-responses.docs.md
 */

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class DetectionService {
    /**
     * Определяет детектор, который следует использовать на основе запроса
     */
    private static getDetector(request: DetectionRequest) {
        const detectorName = request.detectorName || 'SuspiciousApprovalsDetector'

        // Выбираем детектор в зависимости от имени
        switch (detectorName) {
            case 'RugpullDetector':
            default:
                return new RugpullDetector()
        }
    }

    /**
     * Обрабатывает запрос на обнаружение, используя соответствующий детектор
     */
    public static async detect(request: DetectionRequest): Promise<DetectionResponse> {
        // Получаем подходящий детектор
        const detector = this.getDetector(request)

        // Создаем событие транзакции из запроса
        const txEvent = CreateTransactionEvent(request.trace)

        // Выполняем обнаружение с помощью детектора
        const findings = await detector.handleTransaction(txEvent)

        // Определяем результат: считаем, что подозрительная активность обнаружена,
        // если есть хотя бы одно finding
        const detectionResult = (await findings).length > 0

        // Дополнительные данные для ответа
        const additionalData = detectionResult ? { findings } : undefined

        /**
         * Формируем ответ
         */
        return new DetectionResponse({
            request,
            detectionInfo: {
                detected: detectionResult,
                additionalData,
            },
        })
    }
}
