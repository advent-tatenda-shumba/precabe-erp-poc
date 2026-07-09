/**
 * cn — lightweight className utility.
 * Filters out falsy values and joins the rest with a space.
 *
 * @example
 * cn(styles.btn, isActive && styles.active, className)
 */
export function cn(...classes: (string | undefined | null | false | 0)[]): string {
  return classes.filter(Boolean).join(' ');
}
