export const ACTIVITY_MONITOR_CONFIG = {
    IDLE_TIMEOUT: 20 * 60 * 1000,         // 20 minutos
    WARNING_THRESHOLD: 3 * 60 * 1000,     // 3 minutos
    HIGH_FREQ_INTERVAL: 1000,             // cada segundo (cuando falta poco)
    LOW_FREQ_INTERVAL: 60 * 1000          // cada minuto (cuando falta mucho)
};
