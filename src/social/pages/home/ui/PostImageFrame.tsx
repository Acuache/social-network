import { useExtractorColorImg } from "@/social/hooks/useExtractorColorImg";
interface Props {
  urlImg: string
}
export const PostImageFrame = ({ urlImg }: Props) => {
  const { imgRef, bgColor } = useExtractorColorImg();

  return (
    <div className="rounded-lg overflow-hidden flex items-center justify-center max-h-[500px]" style={{ background: bgColor }}>
      <img
        ref={imgRef}
        crossOrigin="anonymous"
        className="object-contain max-h-[500px] h-full "
        src={urlImg}
        alt="" />
    </div>
  )
}
