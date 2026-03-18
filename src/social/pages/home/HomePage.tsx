import { useSupabaseSubscription } from "@/hooks/useSupabaseSubscription"
import { HeaderHome } from "./ui/HeaderHome"
import { MainHome } from "./ui/MainHome"
import { SelectAvatarUser } from "@/social/components/SelectAvatarUser"
export const HomePage = () => {
  useSupabaseSubscription({
    channelName: 'public:publications',
    options: {
      event: '*',
      schema: 'public',
      table: 'publications',
    },
    queryKey: ['get post current']
  })
  useSupabaseSubscription({
    channelName: 'public:comments',
    options: {
      event: '*',
      schema: 'public',
      table: 'comments',
    },
    queryKey: ['get comments']
  })
  return (
    <div className="flex flex-col flex-1 min-h-0 border-mode">
      <SelectAvatarUser />
      <HeaderHome />
      <MainHome />
    </div>
  )
}
