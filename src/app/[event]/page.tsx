"use client"
import EventForm from "@/components/EventForm"
import { useParams } from "next/navigation"

export default function EventPage() {
  const params = useParams()
  const eventKey = (params?.event as string)?.toLowerCase() || "meetup"
  return <EventForm eventKey={eventKey} />
}
