import { cloneElement, ReactNode, useState } from "react";
import {
  Placement,
  offset,
  flip,
  shift,
  autoUpdate,
  useFloating,
  useInteractions,
  useHover,
  useFocus,
  useRole,
  useDismiss, FloatingPortal
} from "@floating-ui/react-dom-interactions";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  enabled?: boolean;
  label?: ReactNode;
  placement?: Placement;
  children: JSX.Element;
  noWrap?: boolean;
}

export const Tooltip = ({ enabled = true, children, label, placement = "bottom", noWrap = false }: Props) => {
  const [open, setOpen] = useState(false);

  const { x, y, reference, floating, strategy, context } = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    middleware: [offset(5), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useHover(context, { restMs: 40 }),
    useFocus(context, { keyboardOnly: false }),
    useRole(context, { role: "tooltip" }),
    useDismiss(context)
  ]);

  return (
    <>
      {cloneElement(
        children,
        getReferenceProps({ ref: reference, ...children.props })
      )}
      <FloatingPortal>
        <AnimatePresence>
          {enabled && label && open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, translateY: -2 }}
              animate={{ opacity: 1, scale: 1, translateY: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: .1 }}
              // transition={{ type: "spring", damping: 20, stiffness: 200 }}
              {...getFloatingProps({
                ref: floating,
                className: `px-3 py-1 text-sm rounded border shadow select-none cursor-default z-50
              text-gray-800 bg-gray-200/95 border-gray-300
              dark:text-gray-50 dark:bg-[#323848]/90 dark:border-[#222633] ${noWrap ? 'whitespace-nowrap' : ''}
              `,
                style: {
                  position: strategy,
                  top: y ?? 0,
                  left: x ?? 0,
                }
              })}
            >
              {label}
            </motion.div>
          )}
        </AnimatePresence>
      </FloatingPortal>
    </>
  );
};

export default Tooltip;
