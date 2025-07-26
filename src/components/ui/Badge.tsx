// Re-export from the consolidated badge component
import { Badge as BadgeComponent } from "./badge";

// Re-export the Badge component with both named and default exports
// to maintain backward compatibility
export const Badge = BadgeComponent;
export default Badge;