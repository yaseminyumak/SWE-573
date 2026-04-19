interface Props {
  label: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmModal({ label, onConfirm, onCancel }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />

      {/* dialog */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 p-6 border border-[#d67ec9]">
        <h2 className="text-base font-bold text-[#171433] mb-2">Confirm deletion</h2>
        <p className="text-sm text-gray-600 mb-6">
          <span className="font-semibold text-[#171433]">"{label}"</span> will be permanently deleted. This cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:border-[#8c2d9c] hover:text-[#8c2d9c] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
