"use client"

import * as React from "react"
import { createContext, useContext } from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/* -------------------------------------------------------------------------------------------------
 * Context
 * ----------------------------------------------------------------------------------------------- */

export interface SidebarContextValue {
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
  collapsedWidth: number | undefined
  onToggle: ((collapsed: boolean) => void) | undefined
}

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined)

export function useSidebar() {
  const context = useContext(SidebarContext)

  if (!context) {
    throw new Error("useSidebar must be used within a <Sidebar />")
  }

  return context
}

/* -------------------------------------------------------------------------------------------------
 * Provider
 * ----------------------------------------------------------------------------------------------- */

interface SidebarProviderProps {
  children: React.ReactNode
  /** What size should the sidebar collapse to in pixels */
  collapsedWidth?: number
  /** When the sidebar is toggled */
  onToggle?: (collapsed: boolean) => void
  /** External controlled state */
  collapsed?: boolean
  /** Set external controlled state */
  setCollapsed?: (collapsed: boolean) => void
}

export function SidebarProvider({
  children,
  collapsedWidth,
  onToggle,
  collapsed: controlledCollapsed,
  setCollapsed: setControlledCollapsed,
}: SidebarProviderProps) {
  // Handle both controlled and uncontrolled mode
  const isControlled = controlledCollapsed !== undefined
  const [_collapsed, _setCollapsed] = React.useState(false)

  const collapsed = isControlled ? controlledCollapsed : _collapsed
  const setCollapsed = React.useCallback((value: boolean) => {
    if (isControlled) {
      setControlledCollapsed?.(value)
    } else {
      _setCollapsed(value)
    }
    onToggle?.(value)
  }, [isControlled, setControlledCollapsed, onToggle])

  const value = React.useMemo(() => ({
    collapsed,
    setCollapsed,
    collapsedWidth,
    onToggle,
  }), [collapsed, setCollapsed, collapsedWidth, onToggle])

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Sidebar
 * ----------------------------------------------------------------------------------------------- */

const sidebarVariants = cva(
  "pb-2 overflow-x-hidden transition-[width] flex flex-col w-60 shrink-0 bg-card text-card-foreground h-full",
  {
    variants: {
      collapsible: {
        true: "duration-300 ease-in-out",
        false: "",
      },
    },
    defaultVariants: {
      collapsible: false,
    },
  }
)

export interface SidebarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarVariants> {
  /** Make sidebar collapsible with trigger */
  collapsible?: boolean
}

export const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, collapsible, ...props }, ref) => {
    return (
      <aside
        ref={ref}
        className={cn(sidebarVariants({ collapsible }), className)}
        data-collapsed={collapsible}
        {...props}
      />
    )
  }
)
Sidebar.displayName = "Sidebar"

/* -------------------------------------------------------------------------------------------------
 * SidebarContent
 * ----------------------------------------------------------------------------------------------- */

export interface SidebarContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Collapse content section when sidebar is collapsed */
  collapsible?: boolean
}

export const SidebarContent = React.forwardRef<
  HTMLDivElement,
  SidebarContentProps
>(({ className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("flex-1 overflow-auto", className)} {...props} />
  )
})
SidebarContent.displayName = "SidebarContent"

/* -------------------------------------------------------------------------------------------------
 * SidebarTrigger
 * ----------------------------------------------------------------------------------------------- */

export interface SidebarTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  SidebarTriggerProps
>(({ className, onClick, ...props }, ref) => {
  const { collapsed, setCollapsed } = useSidebar()

  return (
    <button
      ref={ref}
      type="button"
      onClick={(e) => {
        setCollapsed(!collapsed)
        onClick?.(e)
      }}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 w-9",
        className
      )}
      {...props}
    >
      {collapsed ? (
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
        >
          <path
            d="M6.85355 3.14645C7.04882 3.34171 7.04882 3.65829 6.85355 3.85355L3.70711 7H12.5C12.7761 7 13 7.22386 13 7.5C13 7.77614 12.7761 8 12.5 8H3.70711L6.85355 11.1464C7.04882 11.3417 7.04882 11.6583 6.85355 11.8536C6.65829 12.0488 6.34171 12.0488 6.14645 11.8536L2.14645 7.85355C1.95118 7.65829 1.95118 7.34171 2.14645 7.14645L6.14645 3.14645C6.34171 2.95118 6.65829 2.95118 6.85355 3.14645Z"
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
          ></path>
        </svg>
      ) : (
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
        >
          <path
            d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
          ></path>
        </svg>
      )}
      <span className="sr-only">Toggle Sidebar</span>
    </button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

/* -------------------------------------------------------------------------------------------------
 * SidebarGroup
 * ----------------------------------------------------------------------------------------------- */

interface SidebarGroupContextValue {
  open: boolean
}

const SidebarGroupContext = createContext<SidebarGroupContextValue | undefined>(
  undefined
)

function useSidebarGroup() {
  const context = useContext(SidebarGroupContext)
  if (!context) {
    throw new Error(
      "useSidebarGroup must be used within a <SidebarGroup />"
    )
  }
  return context
}

export interface SidebarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether the group is open */
  open?: boolean
  /** Default open state */
  defaultOpen?: boolean
  /** When open state changes */
  onOpenChange?: (open: boolean) => void
}

export const SidebarGroup = React.forwardRef<HTMLDivElement, SidebarGroupProps>(
  (
    {
      className,
      children,
      defaultOpen = false,
      open: controlledOpen,
      onOpenChange,
      ...props
    },
    ref
  ) => {
    // Handle both controlled and uncontrolled mode
    const [_open, _setOpen] = React.useState(defaultOpen)
    const controlled = controlledOpen !== undefined
    const open = controlled ? controlledOpen : _open

    const context = React.useMemo(() => ({ open }), [open])

    return (
      <SidebarGroupContext.Provider value={context}>
        <div
          ref={ref}
          data-state={open ? "open" : "closed"}
          className={cn("px-3", className)}
          {...props}
        >
          <div className="relative space-y-1">{children}</div>
        </div>
      </SidebarGroupContext.Provider>
    )
  }
)
SidebarGroup.displayName = "SidebarGroup"

/* -------------------------------------------------------------------------------------------------
 * SidebarGroupLabel
 * ----------------------------------------------------------------------------------------------- */

export interface SidebarGroupLabelProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  SidebarGroupLabelProps
>(({ className, ...props }, ref) => {
  const { collapsed } = useSidebar()

  return (
    <div
      ref={ref}
      aria-hidden={collapsed}
      className={cn(
        "text-sm font-semibold py-2",
        {
          "transition-opacity opacity-0": collapsed,
        },
        className
      )}
      {...props}
    />
  )
})
SidebarGroupLabel.displayName = "SidebarGroupLabel"

/* -------------------------------------------------------------------------------------------------
 * SidebarGroupContent
 * ----------------------------------------------------------------------------------------------- */

export interface SidebarGroupContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  SidebarGroupContentProps
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("space-y-1", className)} {...props} />
})
SidebarGroupContent.displayName = "SidebarGroupContent"

/* -------------------------------------------------------------------------------------------------
 * SidebarMenu
 * ----------------------------------------------------------------------------------------------- */

export interface SidebarMenuProps extends React.HTMLAttributes<HTMLDivElement> {}

export const SidebarMenu = React.forwardRef<HTMLDivElement, SidebarMenuProps>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("space-y-1", className)} {...props} />
  }
)
SidebarMenu.displayName = "SidebarMenu"

/* -------------------------------------------------------------------------------------------------
 * SidebarMenuItem
 * ----------------------------------------------------------------------------------------------- */

export interface SidebarMenuItemProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const SidebarMenuItem = React.forwardRef<
  HTMLDivElement,
  SidebarMenuItemProps
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("", className)} {...props} />
})
SidebarMenuItem.displayName = "SidebarMenuItem"

/* -------------------------------------------------------------------------------------------------
 * SidebarMenuButton
 * ----------------------------------------------------------------------------------------------- */

export interface SidebarMenuButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Render as a different element */
  asChild?: boolean
}

export const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuButtonProps
>(({ className, asChild = false, ...props }, ref) => {
  const { open } = useSidebarGroup()
  const { collapsed } = useSidebar()

  const Component = asChild ? React.Children.only(props.children!) : "button"

  // @ts-expect-error - asChild pattern
  return <Component 
    ref={ref} 
    type={!asChild ? "button" : undefined}
    role={!asChild ? "button" : undefined}
    className={cn(
      "flex items-center whitespace-nowrap rounded-md p-2 w-full text-sm hover:bg-secondary/50",
      className
    )}
    {...props} 
  />
})
SidebarMenuButton.displayName = "SidebarMenuButton"

/* -------------------------------------------------------------------------------------------------
 * Export
 * ----------------------------------------------------------------------------------------------- */

export {
  SidebarContext,
}
