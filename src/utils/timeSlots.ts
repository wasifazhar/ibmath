export interface ExistingBooking {
  preferredDate: string
  preferredTime: string
  pricingPlan?: string
  status?: string
}

export function normalizeTime(time: string): string {
  return String(time).slice(0, 5)
}

export function isPaidPlan(pricingPlan: string): boolean {
  const plan = String(pricingPlan || '').trim()
  return plan === 'Regular' || plan === 'Intensive'
}

export function getSlotCount(pricingPlan: string): number {
  return isPaidPlan(pricingPlan) ? 2 : 1
}

export function timeToMinutes(time: string): number {
  const [hours, minutes] = normalizeTime(time).split(':').map(Number)
  return hours * 60 + minutes
}

export function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60) % 24
  const mins = minutes % 60
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
}

export function generateHalfHourSlots(): string[] {
  const slots: string[] = []
  for (let minutes = 0; minutes < 24 * 60; minutes += 30) {
    slots.push(minutesToTime(minutes))
  }
  return slots
}

export function getLockedSlots(startTime: string, slotCount: number): string[] {
  const startMinutes = timeToMinutes(startTime)
  const slots: string[] = []
  for (let i = 0; i < slotCount; i++) {
    const slotMinutes = startMinutes + i * 30
    if (slotMinutes >= 24 * 60) break
    slots.push(minutesToTime(slotMinutes))
  }
  return slots
}

export function isActiveBooking(booking: ExistingBooking): boolean {
  return !booking.status?.includes('Rejected')
}

export function getOccupiedSlotsForDate(bookings: ExistingBooking[], date: string): Set<string> {
  const occupied = new Set<string>()
  for (const booking of bookings) {
    if (!isActiveBooking(booking) || booking.preferredDate !== date) continue
    const locked = getLockedSlots(booking.preferredTime, getSlotCount(booking.pricingPlan || ''))
    locked.forEach((slot) => occupied.add(slot))
  }
  return occupied
}

export function canBookSlot(
  occupied: Set<string>,
  startTime: string,
  pricingPlan: string
): boolean {
  const requested = getLockedSlots(startTime, getSlotCount(pricingPlan))
  if (requested.length !== getSlotCount(pricingPlan)) return false
  return requested.every((slot) => !occupied.has(slot))
}

export function getAvailableStartSlots(bookings: ExistingBooking[], date: string, pricingPlan: string): string[] {
  const occupied = getOccupiedSlotsForDate(bookings, date)
  return generateHalfHourSlots().filter((slot) => canBookSlot(occupied, slot, pricingPlan))
}

export function formatSlotLabel(time: string): string {
  const [hours, minutes] = normalizeTime(time).split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHour = hours % 12 || 12
  return `${displayHour}:${String(minutes).padStart(2, '0')} ${period}`
}

export function formatHourLabel(hour: number): string {
  const period = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:00 ${period}`
}
