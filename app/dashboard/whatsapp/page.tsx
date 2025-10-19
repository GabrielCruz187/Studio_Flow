"use client"
import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { WhatsAppContent } from "@/components/whatsapp-content"

export default async function WhatsAppPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: messages } = await supabase
    .from("whatsapp_messages")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })

  const contactsMap = new Map()
  messages?.forEach((msg) => {
    const contactKey = msg.contact_phone
    if (!contactsMap.has(contactKey)) {
      contactsMap.set(contactKey, {
        id: contactKey,
        name: msg.contact_name,
        phone: msg.contact_phone,
        lastMessage: msg.message,
        lastMessageTime: new Date(msg.created_at).toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        unreadCount: 0,
        online: false,
      })
    } else {
      const contact = contactsMap.get(contactKey)
      contact.lastMessage = msg.message
      contact.lastMessageTime = new Date(msg.created_at).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    }
  })

  const contacts = Array.from(contactsMap.values())

  return <WhatsAppContent initialMessages={messages || []} initialContacts={contacts} user={user} />
}
