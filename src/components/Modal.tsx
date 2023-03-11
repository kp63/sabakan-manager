import React, { Fragment, ReactNode, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  title?: ReactNode;
  trigger?: ReactNode;
  superChild?: boolean;
  children: ReactNode;
  wideModal?: boolean;
  forceMount?: boolean;
  onClose?: (value: false) => void;
}
export default function Modal({ title, children, trigger, wideModal, superChild, forceMount, onClose }: Props) {
  let [isOpen, setIsOpen] = useState(!!forceMount)

  function closeModal() {
    forceMount || setIsOpen(false);
    typeof onClose === "function" && onClose(false);
  }

  function openModal() {
    setIsOpen(true)
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => open ? openModal() : closeModal()}>
      {trigger && (
        <Dialog.Trigger asChild>
          {trigger}
        </Dialog.Trigger>
      )}

      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            <div className="fixed inset-0 overflow-y-auto z-30">
              {/*<Dialog.Overlay forceMount className="fixed inset-0 bg-black/25" />*/}
              <Dialog.Overlay forceMount asChild>
                <motion.div
                  key="modal-overlay"
                  className="fixed inset-0 bg-black/25"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: .2, ease: "easeInOut" }}
                />
              </Dialog.Overlay>
              <motion.div
                key="modal"
                className="relative flex min-h-full items-center justify-center p-4 text-center"
                initial={{ scale: .98, bottom: 2, opacity: 0 }}
                animate={{ scale: 1, bottom: 0, opacity: 1 }}
                exit={{ scale: .98, bottom: 2, opacity: 0 }}
                transition={{ duration: .2, ease: "easeInOut" }}
              >
                <Dialog.Content forceMount asChild>
                  {superChild ? children : (
                    <div className={`w-full ${wideModal ? "max-w-2xl" : "max-w-md"} transform overflow-hidden rounded-lg bg-white dark:bg-gray-700 p-6 text-left align-middle shadow-xl transition-all`}>
                      {title && (
                        <Dialog.Title
                          className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100 mb-2"
                        >
                          {title}
                        </Dialog.Title>
                      )}
                      {children}
                      {/*<div className="mt-2">*/}
                      {/*  <p className="text-sm text-gray-500">*/}
                      {/*    Your payment has been successfully submitted. We’ve sent*/}
                      {/*    you an email with all of the details of your order.*/}
                      {/*  </p>*/}
                      {/*</div>*/}

                      {/*<div className="mt-4">*/}
                      {/*  <button*/}
                      {/*    type="button"*/}
                      {/*    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"*/}
                      {/*    onClick={closeModal}*/}
                      {/*  >*/}
                      {/*    Got it, thanks!*/}
                      {/*  </button>*/}
                      {/*</div>*/}
                    </div>
                  )}
                </Dialog.Content>
              </motion.div>
            </div>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}
