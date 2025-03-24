import { FC } from "react";
import { Button, IconButton } from "@material-tailwind/react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

type PaginationProps = {
  total_pages: number
  current: number
  setCurrent: (page: number) => void
}

export const Pagination: FC<PaginationProps> = ({
  total_pages, current, setCurrent
}) => {
  const getItemProps = (index: number) =>
    ({
      variant: current === index ? "filled" : "text",
      color: "gray",
      onClick: () => setCurrent(index),
    } as any)

  const next = () => {
    if (current >= total_pages) return;
    setCurrent(current + 1);
  }

  const prev = () => {
    if (current === 1) return;
    setCurrent(current - 1);
  }

  const buttons = [
    <IconButton key={`key_pagination_1`} {...getItemProps(1)}>1</IconButton>
  ]
  for (let i = 2; i <= total_pages; i++) {
    buttons.push(
      <IconButton key={`key_pagination_${i}`} {...getItemProps(i)}>{i}</IconButton>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="text"
        className="flex items-center gap-2"
        onClick={prev}
        disabled={current === 1}
      >
        <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" /> Previous
      </Button>
      <div className="flex items-center gap-2">
        {buttons}
      </div>
      <Button
        variant="text"
        className="flex items-center gap-2"
        onClick={next}
        disabled={current >= total_pages}
      >
        Next
        <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
      </Button>
    </div>
  );
}