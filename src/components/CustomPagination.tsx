import {
  Pagination,
  PaginationContent,
} from "@/components/ui/pagination"
import { Button } from "./ui/button"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

interface Props {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  siblings?: number
}

function getPageRange(current: number, total: number, siblings: number) {
  const pages: (number | "ellipsis-start" | "ellipsis-end")[] = []

  const left = Math.max(current - siblings, 1)
  const right = Math.min(current + siblings, total)

  if (left > 2) {
    pages.push(1, "ellipsis-start")
  } else {
    for (let i = 1; i < left; i++) pages.push(i)
  }

  for (let i = left; i <= right; i++) pages.push(i)

  if (right < total - 1) {
    pages.push("ellipsis-end", total)
  } else {
    for (let i = right + 1; i <= total; i++) pages.push(i)
  }

  return pages
}

export const CustomPagination = ({ currentPage, totalPages, onPageChange, siblings = 2 }: Props) => {
  const pages = getPageRange(currentPage, totalPages, siblings)

  return (
    <Pagination>
      <PaginationContent>
        <Button
          variant="outline"
          size="icon"
          className="size-8"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft className="size-4" />
        </Button>

        {pages.map((item) =>
          typeof item === "string" ? (
            <MoreHorizontal key={item} className="size-4 text-muted-foreground mx-1" />
          ) : (
            <Button
              key={item}
              variant={currentPage === item ? "default" : "outline"}
              size="sm"
              className="size-8"
              onClick={() => onPageChange(item)}
            >
              {item}
            </Button>
          )
        )}

        <Button
          variant="outline"
          size="icon"
          className="size-8"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRight className="size-4" />
        </Button>
      </PaginationContent>
    </Pagination>
  )
}
