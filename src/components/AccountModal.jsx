import React, { useEffect, useRef } from "react";

export default function AccountModal({ show, onClose, children }) {
  const modalRef = useRef();

  // Trap focus within modal
  useEffect(() => {
    if (!show) return;
    const focusable = modalRef.current.querySelectorAll("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])");
    if (focusable.length) focusable[0].focus();
    const handleTab = (e) => {
      if (e.key !== "Tab") return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          last.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    };
    modalRef.current.addEventListener("keydown", handleTab);
    return () => modalRef.current?.removeEventListener("keydown", handleTab);
  }, [show]);

  // Close on Esc
  useEffect(() => {
    if (!show) return;
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50"
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
      ref={modalRef}
      tabIndex={-1}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full"
        onClick={e => e.stopPropagation()}
      >
        <button
          aria-label="Close modal"
          className="absolute top-2 right-2 text-xl"
          onClick={onClose}
        >×</button>
        <h2 id="modal-title" className="sr-only">Account Modal</h2>
        {children}
      </div>
    </div>
  );
}