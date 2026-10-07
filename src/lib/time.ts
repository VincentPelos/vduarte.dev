/** Hora `HH:MM` (24 h) de `date` en la zona IANA indicada. */
export function formatTime(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat('es-CL', {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZone,
  }).format(date);
}
