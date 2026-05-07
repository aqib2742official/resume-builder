const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function formatMonthYear(date: string): string {
  if (!date) return ''
  const [year, month] = date.split('-')
  const monthIndex = parseInt(month, 10) - 1
  if (isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) return year ?? ''
  return `${MONTHS[monthIndex]} ${year}`
}

export function formatDateRange(
  startDate: string,
  endDate: string,
  currentlyWorking: boolean
): string {
  const start = formatMonthYear(startDate)
  const end = currentlyWorking ? 'Present' : formatMonthYear(endDate)
  if (!start && !end) return ''
  if (!end) return start
  return `${start} – ${end}`
}

export function formatSingleDate(date: string): string {
  return formatMonthYear(date)
}
