/* eslint-disable @typescript-eslint/no-unused-vars */
import { Tooltip as ChakraTooltip} from "@chakra-ui/react"
import * as React from "react"

export interface TooltipProps {
  showArrow?: boolean
  portalled?: boolean
  portalRef?: React.RefObject<HTMLElement>
  content: React.ReactNode
  disabled?: boolean
  children: React.ReactNode
  placement?: 'top' | 'bottom' | 'left' | 'right'
  isOpen?: boolean
  onOpen?: () => void
  onClose?: () => void
}

export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  function Tooltip(props, _ref) {
    const {
      showArrow,
      children,
      disabled,
      portalled = true,
      content,
      portalRef,
      placement = 'top',
      isOpen,
      onOpen,
      onClose,
      ...rest
    } = props

    if (disabled) return <>{children}</>

    return (
      <ChakraTooltip
        label={content}
        placement={placement}
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        hasArrow={showArrow}
        {...rest}
      >
        {children}
      </ChakraTooltip>
    )
  },
)
