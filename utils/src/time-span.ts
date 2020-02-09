import { ITimeSpan } from '@tb/interfaces';

export namespace TimeSpanUtils {
    /**
     * Creates string from a time-span.
     *
     * @export
     * @param {ITimeSpan} value
     * @returns {string}
     */
    export function ITimeSpanToString(value: ITimeSpan): string {
        let result = [];
        if (value.years) result.push(`${value.years} Jahre`);
        if (value.month) result.push(`${value.month} Monate`);
        if (value.days) result.push(`${value.days} Tage`);
        if (value.hours) result.push(`${value.hours} Stunden`);
        if (value.min) result.push(`${value.min} Minuten`);
        if (value.seconds) result.push(`${value.seconds} Sekunden`);
        return result.join(' ');
    }

    /**
     * Converts a duration in seconds into a time-span.
     *
     * @export
     * @param {number} seconds
     * @returns {ITimeSpan}
     */
    export function SecondsToTimeSpan(seconds: number): ITimeSpan {
        const result: ITimeSpan = {};
        result.seconds = seconds % 60;
        const minutes = (seconds - result.seconds) / 60;
        result.min = minutes % 60;
        const hours = (minutes - result.min) / 60;
        result.hours = hours % 24;
        const days = (hours - result.hours) / 24;
        result.days = days % 30;
        const month = (days - result.days) / 30;
        result.month = month % 12;
        result.years = (month - result.month) / 12;
        return result;
    }

    export function TimeSpanToSeconds(timeSpan: ITimeSpan): number {
        let result = timeSpan.seconds || 0;
        if (timeSpan.min) {
            result += timeSpan.min * 60;
        }
        if (timeSpan.hours) {
            result += timeSpan.hours * 60 * 60;
        }
        if (timeSpan.days) {
            result += timeSpan.days * 60 * 60 * 24;
        }
        if (timeSpan.month) {
            result += timeSpan.month * 60 * 60 * 24 * 30;
        }
        if (timeSpan.years) {
            result += timeSpan.years * 60 * 60 * 24 * 30 * 12;
        }
        return result;
    }

    export function AddTimeSpans(a: ITimeSpan, b: ITimeSpan): ITimeSpan {
        return SecondsToTimeSpan(TimeSpanToSeconds(a) + TimeSpanToSeconds(b));
    }

    /**
     * Function to convert an ITime object into minutes 
     * needed for searching in hikes, bc all hike durations are given in minutes
     * @export
     * @param {ITimeSpan} timeSpan
     * @returns {number} returns timespan in minutes 
     */
    export function timeSpanToMinutes(timeSpan: ITimeSpan): number {
        let result = 0;
        if (timeSpan.seconds) {
            result += timeSpan.seconds / 60;
        }
        if (timeSpan.min) {
            result += timeSpan.min;
        }
        if (timeSpan.hours) {
            result += timeSpan.hours * 60;
        }
        if (timeSpan.days) {
            result += timeSpan.days * 24 * 60;
        }
        return result;
    }

}
