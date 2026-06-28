import "svelte-lib/styles/app.css"
import "svelte-lib/styles/root.css"

import { launchFireworkBurst } from "./lib/functions"

// Make the function available globally
window.launchFireworkBurst = launchFireworkBurst
