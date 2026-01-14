export default function Pagination({ page, setPage, hasNext }) {
  return (
    <div className="flex justify-center gap-[12px] mt-[40px]">
      {page > 1 && (
        <button
          className="px-[12px] py-[6px] border cursor-pointer"
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>
      )}

      <span className="font-semibold">{page}</span>

      {hasNext && (
        <button
          className="px-[12px] py-[6px] border cursor-pointer"
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      )}
    </div>
  );
}
