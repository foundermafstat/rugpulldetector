import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

import { rugpullTestData } from './rugpull-test-data'

// Базовый URL для API
const API_BASE_URL = 'http://localhost:3000' // Измените на ваш реальный URL

// Типы данных для запроса и ответа (такие же как и в detect-client.ts)
interface DetectionRequestTraceLog {
    address: string
    data: string
    topics: string[]
}

interface DetectionRequestTraceCall {
    from: string
    to: string
    input: string
    output?: string
    value?: string
    gasUsed: string
    calls?: DetectionRequestTraceCall[]
}

interface DetectionRequestState {
    balance: string
    nonce?: number
    code?: string
    storage?: Record<string, string>
}

interface DetectionRequestTrace {
    transactionHash?: string
    blockNumber?: number
    from: string
    to: string | null
    value?: string
    gas: string
    gasUsed: string
    input: string
    output?: string
    pre: Record<string, DetectionRequestState>
    post: Record<string, DetectionRequestState>
    calls?: DetectionRequestTraceCall[]
    logs?: DetectionRequestTraceLog[]
}

interface DetectionRequest {
    detectorName?: string
    id?: string
    chainId: number
    hash: string
    protocolName?: string
    protocolAddress?: string
    trace: DetectionRequestTrace
    additionalData?: Record<string, unknown>
}

interface DetectionResponse {
    requestId: string
    chainId: number
    detected: boolean
    error?: boolean
    message?: string
    protocolAddress?: string
    protocolName?: string
    additionalData?: Record<string, unknown>
}

/**
 * Тестовый клиент для обращения к API эндпоинту /detect с специализацией на Rugpull детектор
 */
export class RugpullDetectorClient {
    private baseUrl: string

    constructor(baseUrl: string = API_BASE_URL) {
        this.baseUrl = baseUrl
    }

    /**
     * Отправляет запрос на эндпоинт /detect с указанием использования Rugpull детектора
     * @param request Объект запроса
     * @returns Ответ от API
     */
    async detect(request: Partial<DetectionRequest>): Promise<DetectionResponse> {
        // Заполняем обязательные поля, если они отсутствуют
        const completeRequest: DetectionRequest = {
            id: request.id || uuidv4(),
            detectorName: 'RugpullDetector', // Указываем имя нашего детектора
            chainId: request.chainId || 1, // Ethereum mainnet по умолчанию
            hash:
                request.hash ||
                '0x0000000000000000000000000000000000000000000000000000000000000000',
            trace: request.trace || this.createDefaultTrace(),
            ...request,
        }

        try {
            const response = await axios.post<DetectionResponse>(
                `${this.baseUrl}/detect`,
                completeRequest,
            )
            return response.data
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.error('API ошибка:', error.response.data)
                throw new Error(
                    `Ошибка API: ${error.response.status} - ${JSON.stringify(error.response.data)}`,
                )
            }
            throw error
        }
    }

    /**
     * Получает пример тестовых данных по типу
     * @param testType Тип тестовых данных
     * @returns Пример запроса для тестирования
     */
    getTestData(
        testType: 'contractDeployment' | 'suspiciousCall' | 'pauseCall' | 'mintCall',
    ): DetectionRequest {
        return rugpullTestData[testType]
    }

    /**
     * Получает все тестовые данные для Rugpull детектора
     * @returns Объект со всеми тестовыми данными
     */
    getAllTestData(): Record<string, DetectionRequest> {
        return rugpullTestData
    }

    /**
     * Создает простую структуру trace для запроса
     * @returns Базовая структура trace
     */
    private createDefaultTrace(): DetectionRequestTrace {
        // Адреса для примера
        const ownerAddress = '0x1234567890123456789012345678901234567890'
        const contractAddress = '0x7a16ff8270133f063aab6c9977183d9e72835428'

        return {
            from: ownerAddress,
            to: contractAddress,
            gas: '200000',
            gasUsed: '100000',
            input: '0xf2fde38b0000000000000000000000001234567890123456789012345678901234567890', // transferOwnership
            pre: {
                [ownerAddress]: {
                    balance: '1000000000000000000',
                },
                [contractAddress]: {
                    balance: '0',
                    code: '0x608060405234801561001057600080fd5b506004361061004c5760003560e01c80638456cb591461005157806395d89b411461005b578063a0712d6814610079578063f2fde38b14610095575b600080fd5b6100596100b1565b005b610063610152565b6040516100709190610b27565b60405180910390f35b610093600480360381019061008e9190610aa2565b6101e4565b005b6100af60048036038101906100aa9190610b42565b610276565b005b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610141576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161013890610b27565b60405180910390fd5b6000600360006101000a81548160ff021916908315150217905550565b6060600280546101619190610afd565b80601f016020809104026020016040519081016040528092919081815260200182805461018d9190610afd565b80156101da5780601f106101af576101008083540402835291602001916101da565b5b5090506101e9565b90565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610274576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161026b90610b27565b60405180910390fd5b8061027e6100b1565b5050565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610306576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102fd90610b27565b60405180910390fd5b806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505056',
                },
            },
            post: {
                [ownerAddress]: {
                    balance: '999999750000000000',
                },
                [contractAddress]: {
                    balance: '0',
                },
            },
        }
    }
}

/**
 * Запускает тестирование детектора Rugpull с разными типами данных
 */
async function runRugpullTests() {
    const client = new RugpullDetectorClient()
    const testResults: Record<string, DetectionResponse> = {}

    try {
        // Тестируем каждый тип подозрительной активности
        const testTypes = ['contractDeployment', 'suspiciousCall', 'pauseCall', 'mintCall'] as const

        console.log('🔍 Запуск тестирования детектора Rugpull...\n')

        for (const testType of testTypes) {
            const testData = client.getTestData(testType)

            console.log(`\n📋 Тест: ${testType}`)
            console.log(`🔹 Хэш транзакции: ${testData.hash}`)
            console.log(`🔹 Протокол: ${testData.protocolName}`)

            if (testType !== 'contractDeployment') {
                const callInput = testData.trace.input.slice(0, 10)
                console.log(`🔹 Сигнатура вызова: ${callInput}`)
            }

            console.log('\nОтправка запроса...')
            const response = await client.detect(testData)
            testResults[testType] = response

            console.log('\n📊 Результат:')
            console.log(JSON.stringify(response, null, 2))

            if (response.detected) {
                console.log('\n🚨 ПРЕДУПРЕЖДЕНИЕ: Обнаружена потенциальная угроза Rugpull!')
            } else {
                console.log('\n✅ Подозрительная активность не обнаружена.')
            }
        }

        console.log('\n📈 Итоги тестирования:')

        let detectedCount = 0
        for (const [testType, result] of Object.entries(testResults)) {
            if (result.detected) {
                detectedCount++
                console.log(`🔴 ${testType}: Обнаружены подозрительные действия`)
            } else {
                console.log(`🟢 ${testType}: Подозрительные действия не обнаружены`)
            }
        }

        console.log(`\n📊 Обнаружено ${detectedCount} из ${testTypes.length} потенциальных угроз.`)

        return testResults
    } catch (error) {
        console.error('\n❌ Ошибка при выполнении тестов:')
        console.error(error)
        throw error
    }
}

// Запускаем тесты если файл выполняется напрямую
if (require.main === module) {
    runRugpullTests()
        .then(() => console.log('\n✅ Тестирование завершено успешно.'))
        .catch(() => console.log('\n❌ Тестирование завершено с ошибками.'))
}
