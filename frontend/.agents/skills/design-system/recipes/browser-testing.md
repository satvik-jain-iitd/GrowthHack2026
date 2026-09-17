## Guidance for Active Browser-Based Testing  
  
### Opening and Navigating  
  
1. Use `open_browser_page(url)` to launch the target page  
2. Use `read_page(pageId)` to inspect structure and read text content  
3. Use `screenshot_page(pageId)` to capture evidence before and after interactions  
  
### Keyboard Testing  
  
1. Use `type_in_page(pageId, key: "Tab")` to navigate forward  
2. Use `type_in_page(pageId, key: "Shift+Tab")` to navigate backward  
3. Use `type_in_page(pageId, key: "Enter")` to activate focused elements  
4. Use `type_in_page(pageId, key: "Space")` to toggle checkboxes, buttons, etc.  
5. Use `type_in_page(pageId, key: "Escape")` to close overlays  
6. Use `type_in_page(pageId, key: "ArrowUp")`, `"ArrowDown"`, `"ArrowLeft"`, `"ArrowRight"` for custom widgets  
7. Use `type_in_page(pageId, key: "Home")`, `"End"`, `"PageUp"`, `"PageDown"` for sliders and tabs  
8. After each keystroke, take a screenshot to capture focus state and behavior  
  
### ARIA State Change Testing  
  
1. Use `read_page(pageId)` to capture ARIA attributes **before** interaction  
2. Perform the interaction via `type_in_page` or `click_element`  
3. Use `read_page(pageId)` again to capture ARIA attributes **after** interaction  
4. Compare before/after values and record any discrepancies  
5. Take screenshots at each state as evidence  
  
### Manual Deep Checks  
  
1. Exercise at least one complete task flow end-to-end using only keyboard input  
2. Validate error recovery paths and confirmation/success paths manually  
3. Re-check focus visibility and semantics after dynamic UI changes  
4. Trigger form validation and verify ARIA state transitions (aria-invalid, aria-describedby, role="alert")  
  
### Inspecting Elements and State  
  
1. Use `read_page(pageId)` to get the full DOM and text content  
2. Look for ARIA attributes, roles, and relationships  
3. Verify semantic HTML (button, header, nav, main, form, input, label, etc.)  
4. Screenshot specific elements or focus states for evidence  
  
### Capturing Evidence  
  
1. Take screenshots at each major step (baseline, after keyboard nav, after interaction, error states, corrected states)  
2. Name or number them clearly (e.g., "01-baseline", "02-focus-on-button", "03-modal-open", "04-form-error", "05-form-corrected")  
3. Include them in the final report with explanations  