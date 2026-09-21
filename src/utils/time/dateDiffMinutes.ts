/**
 * Calcula la diferencia en minutos entre dos fechas y horas.
 */

interface DateWithTime {
    date: Date;
    hour: number;
    minute: number;
    second?: number;
}

/**
 * Convierte una fecha/hora a total de minutos desde epoch
 */
const minutesFromDateTime = (dt: DateWithTime): number => {
    const year = dt.date.getFullYear();
    const month = dt.date.getMonth() + 1; // 0-based
    const day = dt.date.getDate();
    
    const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const timeMinutes = dt.hour * 60 + dt.minute;
    
    return new Date(dateStr).getTime() / (1000 * 60) + timeMinutes;
};

/**
 * Parsea un string de fecha YYYY-MM-DD HH:MM a objeto DateWithTime
 */
const parseDateTimeStr = (str: string): DateWithTime | null => {
    if (!str || typeof str !== 'string') return null;
    
    const match = str.match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{1,2}):?(\d{2}?)(?::(\d{2})?)?$/);
    if (!match) return null;
    
    const [, year, month, day, hour, minute, second] = match;
    
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    if (isNaN(date.getTime())) return null;
    
    return {
        date,
        hour: parseInt(hour),
        minute: parseInt(minute),
        second: second ? parseInt(second) : 0
    };
};

export const diffDateTimeMinutes = (fromStr: string, toStr: string): 
    | { ok: false; error: string } 
    | { ok: true; minutes: number; days: number; hours: number; minutesLeft: number } => {
    
    try {
        const from = parseDateTimeStr(fromStr);
        const to = parseDateTimeStr(toStr);
        
        if (!from || !to) {
            throw new Error('Formato de fecha/hora inválido');
        }
        
        // Validar fecha final no anterior a inicial
        const fromTimestamp = from.date.getTime() * 1000 + (from.hour * 3600000) + (from.minute * 60000) + (from.second * 1000);
        const toTimestamp = to.date.getTime() * 1000 + (to.hour * 3600000) + (to.minute * 60000) + (to.second * 1000);
        
        if (toTimestamp < fromTimestamp) {
            throw new Error('La fecha/hora final no puede ser anterior a la inicial');
        }
        
        const totalMinutes = Math.floor((toTimestamp - fromTimestamp) / 60000);
        
        const days = Math.floor(totalMinutes / (24 * 60));
        const remainingMinutes = totalMinutes % (24 * 60);
        const hours = Math.floor(remainingMinutes / 60);
        const minutesLeft = remainingMinutes % 60;
        
        return {
            ok: true,
            minutes: totalMinutes,
            days,
            hours,
            minutesLeft
        };
    } catch (error) {
        console.error('Error en diffDateTimeMinutes:', error);
        return {
            ok: false,
            error: error instanceof Error ? error.message : 'Error en el cálculo'
        };
    }
};
