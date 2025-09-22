import { X } from "lucide-react";
import { useEffect } from "react";

const Modal = ({
  isModalOpen,
  onModalClose,
  children,
  title,
  footer = null,
  widthClass = "",
  heightClass = "h-[70vh]",
}) => {
  useEffect(() => {
    if (!isModalOpen) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") onModalClose();
    };

    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isModalOpen, onModalClose]);

  if (!isModalOpen) return null;

  const closeModal = (e) => {
    if (e.target && e.target.id === "modal-backdrop") onModalClose();
  };

  return (
    <div
      id="modal-backdrop"
      onClick={closeModal}
      className="fixed inset-0 bg-[rgba(0,0,0,0.4)] flex items-start pt-8 justify-center z-50 p-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      <div
        className={`
          bg-white rounded-lg
          w-[90%] md:w-[70%] xl:w-[60%]
          flex flex-col  max-h-[80vh]
          transform transition-all duration-200
        `}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-b-gray-400">
          <h2 id="modal-title" className="text-lg font-semibold text-gray-800">
            {title}
          </h2>

          <button
            onClick={onModalClose}
            aria-label="Close modal"
            className="ml-4 text-gray-500 hover:text-gray-700 p-1 rounded"
          >
            <X />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">{children}</div>

        {footer && <div className="px-6 py-3 border-t">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
