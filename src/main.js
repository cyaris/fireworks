import { FireworkCanvas } from "./lib/components"

import "svelte-lib/styles/root.css"
import "svelte-lib/styles/app.css"

let div = document.createElement("div")
div.classList.add("fireworks")

let script = document.currentScript
script.parentNode.insertBefore(div, script)

new FireworkCanvas({
  target: div,
})
