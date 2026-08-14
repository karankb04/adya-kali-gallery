"use client";
import { useEffect } from "react";

export interface FacetOption {
  value: string;
  label: string;
  count?: number;
}

interface FacetDropdownProps {
  label: string;
  /** Text shown on the trigger button (e.g. "Form" when unset, "Bhadra Kali" when a value is picked). */
  buttonLabel: string;
  /** Whether a non-default value is active (drives the trigger's "on" styling). */
  active: boolean;
  options: FacetOption[];
  value: string;
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  onSelect: (value: string) => void;
}

/**
 * Click-to-open facet dropdown: a pill trigger button that reveals a list of
 * options. Only one facet is open at a time (managed by the parent via
 * `open`/`onToggle`/`onClose`) so opening one closes any other. Works
 * identically on touch and desktop — hover was deliberately not used since
 * it doesn't exist on mobile. The panel is an anchored popover on wide
 * screens and a centered sheet with a backdrop on narrow ones (see CSS).
 */
export default function FacetDropdown({
  label,
  buttonLabel,
  active,
  options,
  value,
  open,
  onToggle,
  onClose,
  onSelect,
}: FacetDropdownProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div className="facet">
      <button
        type="button"
        className={`facet-btn${active ? " on" : ""}${open ? " open" : ""}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={onToggle}
      >
        <span className="facet-label">{label}</span>
        <span className="facet-value">{buttonLabel}</span>
        <svg className="facet-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <>
          <button
            type="button"
            className="facet-backdrop"
            aria-hidden="true"
            tabIndex={-1}
            onClick={onClose}
          />
          <div className="facet-panel" role="listbox" aria-label={label}>
            {options.map((opt) => (
              <button
                type="button"
                key={opt.value}
                role="option"
                aria-selected={opt.value === value}
                className={`facet-opt${opt.value === value ? " on" : ""}`}
                onClick={() => onSelect(opt.value)}
              >
                <span>{opt.label}</span>
                {typeof opt.count === "number" && (
                  <span className="facet-count">{opt.count}</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
