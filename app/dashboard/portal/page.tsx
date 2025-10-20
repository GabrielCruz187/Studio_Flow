import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PortalContent } from "@/components/portal-content"

export default async function PortalPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: galleries } = await supabase
    .from("galleries")
    .select(
      `
      *,
      client:clients(name),
      photos(count)
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const { data: clients } = await supabase.from("clients").select("id, name").eq("user_id", user.id)

  const activeGalleries = galleries?.filter((g) => g.status === "active").length || 0
  const totalPhotos = galleries?.reduce((sum, g) => sum + (g.photos?.[0]?.count || 0), 0) || 0

  return (
    <PortalContent
      galleries={galleries || []}
      clients={clients || []}
      stats={{
        activeGalleries,
        totalPhotos,
        downloads: 0,
        favorites: 0,
      }}
    />
  )
}
