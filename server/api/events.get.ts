import type { KqlEvent } from '~~/shared/types/kql'

/**
 * "concerts-event" content blocks are intentionally empty in Kirby — they
 * only mark where the front-end should render the live events list. The
 * real data lives in the site-wide "évènements" collection (site.yml),
 * one page per event using the "event_item" template. We fetch it by
 * template rather than by a fixed parent id/uuid so it keeps working
 * regardless of where editors file that collection in the page tree.
 */
export default defineEventHandler(async () => {
  const events = await kqlFetch<KqlEvent[]>({
    query: 'site.index.filterBy("intendedTemplate", "event_item").sortBy("event_date", "asc")',
    select: {
      id: true,
      title: true,
      date: 'page.event_date.toDate("Y-m-d")',
      time: 'page.event_time',
      type: 'page.event_type',
      location: 'page.event_location',
      ticketLink: 'page.event_ticket_link',
      description: 'page.event_description',
      cover: {
        query: 'page.event_cover.toFile',
        select: FILE_SELECT
      }
    }
  })

  return events ?? []
})
