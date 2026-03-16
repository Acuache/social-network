import { useUserProfileQuery } from "@/auth/stack/UserStack"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useModalStorage } from "@/social/store/useModalStorage"
import { Smile, Upload, X, Image } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useEffect, useRef, useState } from "react"
import EmojiPicker, { Theme } from 'emoji-picker-react';
import imageCompression from "browser-image-compression"
import { usePostStackMutation } from "@/social/stack/PostStack"

export const PostForm = () => {
  const [hasText, setHasText] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const emojiRef = useRef<HTMLDivElement>(null)

  const [showImageSelector, setShowImageSelector] = useState(false)

  const [dragActive, setDragActive] = useState(false)
  const [media, setMedia] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null)
  const [mediaError, setMediaError] = useState<string | null>(null)

  const { mutate: postPublicationMutate, isPending: postPublicationIsPending, data: postPublicationData } = usePostStackMutation()

  useEffect(() => {
    if (!showEmojiPicker) return
    const handleClickOutside = (e: MouseEvent) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target as Node)) {
        setShowEmojiPicker(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showEmojiPicker])

  const setShowModal = useModalStorage(state => state.setShowModal)
  const { data: currentUser } = useUserProfileQuery()
  const onSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const description = ((formData.get('description') as string) ?? '').trim()

    const payload = {
      id_user: currentUser!.id,
      description,
      type_file: mediaType,
      file: media ?? null,
    }
    postPublicationMutate(payload)
    console.log('-> payload', payload)
    console.log('-> postPublicationData', postPublicationData)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateAndSelectMedia = async (file: File) => {
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      setMediaError('Solo puedes subir una imagen o un video.')
      return
    }

    const MAX_SIZE_MB = 40
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024
    if (file.size > MAX_SIZE_BYTES) {
      setMediaError(`El archivo supera los ${MAX_SIZE_MB}MB permitidos.`)
      return
    }

    let selectedFile = file
    if (file.type.startsWith('image/')) {
      try {
        selectedFile = await imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        })
      } catch {
        setMediaError('No se pudo optimizar la imagen. Intenta con otra.')
        return
      }
    }

    if (preview) URL.revokeObjectURL(preview)
    setMedia(selectedFile)
    setMediaType(selectedFile.type.startsWith('video/') ? 'video' : 'image')
    setPreview(URL.createObjectURL(selectedFile))
    setMediaError(null)
  }

  const removeMedia = () => {
    if (preview) URL.revokeObjectURL(preview)
    setMedia(null)
    setMediaType(null)
    setPreview(null)
    setMediaError(null)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const files = e.dataTransfer.files
    if (!files || files.length === 0) return
    if (files.length > 1) {
      setMediaError('Solo puedes subir un archivo a la vez.')
      return
    }
    await validateAndSelectMedia(files[0])
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    if (files.length > 1) {
      setMediaError('Solo puedes subir un archivo a la vez.')
      return
    }
    await validateAndSelectMedia(files[0])
  }
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 backdrop-blur-xl" onClick={setShowModal} >
      <form className="" onClick={(e) => e.stopPropagation()} onSubmit={onSubmit} >
        <Card className="min-w-80 w-140 max-w-140" >
          <CardHeader className="relative">
            <CardTitle className="text-xl">Crear Publicación</CardTitle>
            <CardAction onClick={setShowModal} className="cursor-pointer">
              <X />
            </CardAction>
            <Separator className="absolute w-full -bottom-1" />
          </CardHeader>

          <CardContent className="">
            <CardHeader className="flex items-center p-0 mb-4">
              <Avatar className="size-10">
                <AvatarImage src={currentUser?.avatar || ''} />
                <AvatarFallback>{currentUser?.name[0]}{currentUser?.lastName[0]}</AvatarFallback>
              </Avatar>
              <p className="text-lg">{currentUser?.name} {currentUser?.lastName}</p>
            </CardHeader>
            <Textarea
              ref={textareaRef}
              className="resize-none h-25"
              name="description"
              placeholder="¿Qué estas pensando ahora?"
              onChange={(e) => setHasText(e.target.value.trim().length > 0)}
            />
          </CardContent>

          <CardFooter className="flex items-center justify-between">
            <Button disabled={postPublicationIsPending || (!hasText && mediaType === null)} >
              {
                postPublicationIsPending ? 'Publicando...' : 'Publicar'
              }
            </Button>
            <div className="flex gap-2">
              <div className="relative" ref={emojiRef}>
                <Smile className="cursor-pointer" onClick={() => setShowEmojiPicker(!showEmojiPicker)} />
                <div className="absolute bottom-10 right-0">
                  <EmojiPicker
                    theme={Theme.AUTO}
                    searchDisabled
                    open={showEmojiPicker}
                    onEmojiClick={(emojiObject) => {
                      if (!textareaRef.current) return
                      const textarea = textareaRef.current
                      const start = textarea.selectionStart
                      const end = textarea.selectionEnd
                      const value = textarea.value
                      textarea.value = value.slice(0, start) + emojiObject.emoji + value.slice(end)
                      const newPos = start + emojiObject.emoji.length
                      textarea.setSelectionRange(newPos, newPos)
                      textarea.focus()
                    }}
                  />
                </div>
              </div>
              <Image className="cursor-pointer" onClick={() => setShowImageSelector(prev => !prev)} />
            </div>
          </CardFooter>
          {
            showImageSelector && (
              <div className="px-6 pb-4 flex justify-center">
                {preview ? (
                  <div className="size-85 flex items-center justify-center overflow-hidden rounded-lg">
                    <div className="relative max-w-full max-h-full">
                      {mediaType === 'video' ? (
                        <video src={preview} controls className="max-w-full max-h-85 rounded-lg" />
                      ) : (
                        <img src={preview} alt="Preview" className="max-w-full max-h-85 object-contain rounded-lg" />
                      )}
                      <button
                        type="button"
                        onClick={removeMedia}
                        className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 transition-colors"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${dragActive
                      ? 'border-primary bg-primary/10'
                      : 'border-muted-foreground/30 hover:border-muted-foreground/50'
                      }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      accept="image/*,video/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleFileChange}
                    />
                    <div className="space-y-2">
                      <Upload className="mx-auto size-8 text-muted-foreground" />
                      <p className="text-sm font-medium text-muted-foreground">
                        Arrastra una imagen o video, o haz clic para buscar
                      </p>
                      <p className="text-xs text-muted-foreground/60">
                        1 archivo: imagen o video (max. 10MB)
                      </p>
                      {mediaError && (
                        <p className="text-xs text-red-500">{mediaError}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          }
        </Card>
      </form>

    </div>
  )
}
