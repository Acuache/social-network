import { useForm } from "react-hook-form"
import { useRef, useState } from "react"
import imageCompression from "browser-image-compression"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUserProfileQuery } from "@/auth/stack/UserStack"
import { Check, ImagePlus, Loader2 } from "lucide-react"
import { useUpdateUserMutate } from "../stack/UpdateUserStack"
import { useSessionStore } from "@/auth/storage/AuthStorage"
import { useQueryClient } from "@tanstack/react-query"

const PRESET_AVATARS = [
  "https://rpjjegovgpwpyzxtaxox.supabase.co/storage/v1/object/public/image_video/avatars/avatar1.webp",
  "https://rpjjegovgpwpyzxtaxox.supabase.co/storage/v1/object/public/image_video/avatars/avatar2.webp",
  "https://rpjjegovgpwpyzxtaxox.supabase.co/storage/v1/object/public/image_video/avatars/avatar3.webp",
] as const

type AvatarOption = "avatar1" | "avatar2" | "avatar3" | "custom"

interface AvatarFormValues {
  selected: AvatarOption
  customFile: File | null
}

export const SelectAvatarUser = () => {
  const { data: user } = useUserProfileQuery()
  const session = useSessionStore(state => state.session)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [customPreview, setCustomPreview] = useState<string | null>(null)
  const [isCompressing, setIsCompressing] = useState(false)

  const { setValue, watch, handleSubmit } = useForm<AvatarFormValues>({
    defaultValues: {
      selected: "avatar1",
      customFile: null,
    },
  })

  const selected = watch("selected")

  const handleSelectPreset = (option: AvatarOption) => {
    setValue("selected", option)
  }

  const handleCustomClick = () => {
    if (selected === "custom" || !customPreview) {
      fileInputRef.current?.click()
    }
    setValue("selected", "custom")
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsCompressing(true)
    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 512,
        useWebWorker: true,
      })
      setValue("customFile", compressed)
      setCustomPreview(URL.createObjectURL(compressed))
    } catch {
      setValue("selected", "avatar1")
      setValue("customFile", null)
      setCustomPreview(null)
    } finally {
      setIsCompressing(false)
      e.target.value = ""
    }
  }

  const getPreviewUrl = (): string | null => {
    if (selected === "custom") return customPreview
    const idx = parseInt(selected.replace("avatar", "")) - 1
    return PRESET_AVATARS[idx] ?? null
  }

  const queryClient = useQueryClient()
  const { mutate, isPending } = useUpdateUserMutate()

  const onSubmit = (data: AvatarFormValues) => {
    const onSuccess = () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] })
    }

    if (data.selected === "custom" && data.customFile) {
      mutate(
        { file: data.customFile, id_user: session!.user.id },
        { onSuccess }
      )
    } else {
      const idx = parseInt(data.selected.replace("avatar", "")) - 1
      const url = PRESET_AVATARS[idx]
      mutate(
        { updateData: { avatar: url }, id_user: session!.user.id },
        { onSuccess }
      )
    }
  }

  if (user?.avatar) return null

  const previewUrl = getPreviewUrl()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-sm mx-4 rounded-2xl border border-border bg-background p-6 shadow-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center gap-5">
          <div className="text-center space-y-1">
            <h2 className="text-lg font-semibold">Bienvenido{user?.name ? `, ${user.name}` : ""}</h2>
            <p className="text-sm text-muted-foreground">Selecciona tu foto de perfil para continuar</p>
          </div>

          <Avatar className="size-24 ring-2 ring-primary/20">
            {previewUrl ? (
              <AvatarImage src={previewUrl} />
            ) : null}
            <AvatarFallback className="text-2xl">{user?.name?.[0] ?? "?"}</AvatarFallback>
          </Avatar>

          <div className="flex items-center gap-3">
            {PRESET_AVATARS.map((url, i) => {
              const option = `avatar${i + 1}` as AvatarOption
              const isActive = selected === option
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleSelectPreset(option)}
                  className={`relative rounded-full transition-all ${isActive ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : "opacity-60 hover:opacity-100"
                    }`}
                >
                  <Avatar className="size-14">
                    <AvatarImage src={url} />
                    <AvatarFallback>{i + 1}</AvatarFallback>
                  </Avatar>
                  {isActive && (
                    <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="size-3" />
                    </span>
                  )}
                </button>
              )
            })}

            <button
              type="button"
              onClick={handleCustomClick}
              className={`relative rounded-full transition-all ${selected === "custom" ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : "opacity-60 hover:opacity-100"
                }`}
            >
              <Avatar className="size-14">
                {customPreview ? (
                  <AvatarImage src={customPreview} />
                ) : (
                  <AvatarFallback>
                    {isCompressing ? <Loader2 className="size-5 animate-spin" /> : <ImagePlus className="size-5" />}
                  </AvatarFallback>
                )}
              </Avatar>
              {selected === "custom" && customPreview && (
                <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="size-3" />
                </span>
              )}
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={isPending || isCompressing || (selected === "custom" && !customPreview)}
          >
            {isPending ? <Loader2 className="size-4 animate-spin" /> : "Guardar"}
          </Button>
        </form>
      </div>
    </div>
  )
}
