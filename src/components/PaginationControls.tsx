import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import { useJobItemsContext } from "../lib/hooks";

export default function PaginationControls() {
  const { handleChangePage, currentPage, totalNumberOfPages } = useJobItemsContext();
  return (
    <section className="pagination">
      {currentPage > 1 && (
        <PaginationButton
          direction={"previous"}
          currentPage={currentPage}
          onClick={() => handleChangePage("previous")}
        />
      )}
      {currentPage < totalNumberOfPages && (
        <PaginationButton
          direction={"next"}
          currentPage={currentPage}
          onClick={() => handleChangePage("next")}
        />
      )}
    </section>
  );
}

type PaginationButtonProps = {
  direction: "next" | "previous";
  currentPage: number;
  onClick: () => void;
};

function PaginationButton({
  direction,
  currentPage,
  onClick,
}: PaginationButtonProps) {
  return (
    <button
      className={`pagination__button pagination__button--${direction}`}
      onClick={(e) => {
        onClick();
        e.currentTarget.blur();
      }}
    >
      {direction === "previous" && (
        <>
          <ArrowLeftIcon />
          Page {currentPage - 1}
        </>
      )}
      {direction === "next" && (
        <>
          Page {currentPage + 1}
          <ArrowRightIcon />
        </>
      )}
    </button>
  );
}
