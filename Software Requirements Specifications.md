Okay, here is a comprehensive Software Requirements Specification (SRS) document for the V-Float project, based on the provided directory structure, file contents (`README.md`, `requirements.md`, `package.json`, etc.), and common SRS standards.

---

**Software Requirements Specification**

**V-Float**

**Version 1.0**

**Date: 2025-07-28**

**Prepared For:** Vue 3 Developers
**Prepared By:** V-Float Development Team

---

**Table of Contents**

1.  **Introduction**
    1.1 Purpose
    1.2 Scope
    1.3 Definitions, Acronyms, and Abbreviations
    1.4 References
    1.5 Overview
2.  **Overall Description**
    2.1 Product Perspective
    2.2 Product Features
    2.3 User Classes and Characteristics
    2.4 Operating Environment
    2.5 Design and Implementation Constraints
    2.6 Assumptions and Dependencies
3.  **Specific Requirements**
    3.1 Functional Requirements
        3.1.1 Core Positioning (`useFloating`)
        3.1.2 Middleware Composables/Utilities
        3.1.3 Interaction Composables
        3.1.4 Utility Composables
        3.1.5 Core Components
        3.1.6 Accessibility Support
        3.1.7 Virtual Element Support
        3.1.8 Overflow Detection
    3.2 Non-Functional Requirements
        3.2.1 Performance
        3.2.2 Usability / Developer Experience
        3.2.3 Reliability
        3.2.4 Maintainability
        3.2.5 Portability
        3.2.6 Accessibility
        3.2.7 Tree-Shakability
        3.2.8 Testability
    3.3 Interface Requirements
        3.3.1 User Interfaces
        3.3.2 Software Interfaces
        3.3.3 Hardware Interfaces
        3.3.4 Communications Interfaces
4.  **Appendices** (Optional)
    4.1 Glossary
    4.2 Analysis Models

---

**1. Introduction**

**1.1 Purpose**

This document specifies the requirements for V-Float, a Vue 3 library designed for positioning floating UI elements such as tooltips, popovers, dropdowns, menus, and more. The primary goal of V-Float is to provide a comprehensive, flexible, and performant solution for Vue 3 developers, offering feature parity with the popular `floating-ui/react` library while leveraging the strengths of the Vue 3 Composition API and reactivity system. V-Float is built upon the platform-agnostic `@floating-ui/dom` core positioning engine.

**1.2 Scope**

V-Float will provide a set of Vue 3 composables and optional helper components to:

*   Accurately position floating elements relative to reference elements.
*   Manage the lifecycle and state (`open`/`close`) of floating elements.
*   Implement common interaction patterns (hover, focus, click, dismiss) for triggering and controlling floating elements.
*   Enable advanced features like keyboard navigation (`useListNavigation`, `useTypeahead`), focus management (`FloatingFocusManager`), and visual arrows (`FloatingArrow`).
*   Ensure floating elements remain within viewport boundaries using middleware (`shift`, `flip`, `size`, `hide`, `autoPlacement`).
*   Support positioning relative to virtual elements (e.g., mouse coordinates via `useClientPoint`).
*   Facilitate the creation of accessible floating UI components adhering to ARIA patterns (`useRole`).
*   Allow rendering floating elements in different DOM locations (`FloatingPortal`).
*   Integrate seamlessly with Vue 3's reactivity system and Composition API.

**Out of Scope:**

*   Providing pre-styled, opinionated UI components (e.g., a complete `<Dropdown>` component with styles). V-Float focuses on the positioning and interaction logic primitives.
*   State management solutions beyond the local state of the floating elements.
*   Routing functionalities.
*   Polyfills for older browsers not supporting required JavaScript features or Vue 3.

**1.3 Definitions, Acronyms, and Abbreviations**

*   **Floating Element:** The UI element (e.g., tooltip, popover) that is positioned relative to a reference element.
*   **Reference Element:** The UI element that the floating element is positioned relative to (e.g., a button that triggers a popover).
*   **Middleware:** Functions that modify the positioning calculations (e.g., `offset`, `shift`, `flip`).
*   **Composable:** A function leveraging Vue 3's Composition API to encapsulate and reuse stateful logic (equivalent to React Hooks).
*   **Component:** A reusable Vue UI building block (`.vue` file or functional component).
*   **Placement:** The desired initial position of the floating element relative to the reference (e.g., `'top'`, `'bottom-start'`).
*   **Strategy:** The CSS positioning strategy used (`'absolute'` or `'fixed'`).
*   **Interactions:** User actions (hover, click, focus, keypress) that control the floating element.
*   **Context:** The reactive object returned by `useFloating`, containing state and methods.
*   **`useFloating`:** The primary composable for core positioning logic.
*   **`@floating-ui/dom`:** The core, framework-agnostic positioning engine used by V-Float.
*   **`@floating-ui/react`:** The React implementation of Floating UI, which V-Float aims to mirror in functionality for Vue.
*   **ARIA:** Accessible Rich Internet Applications.
*   **WCAG:** Web Content Accessibility Guidelines.
*   **DOM:** Document Object Model.
*   **SRS:** Software Requirements Specification.
*   **API:** Application Programming Interface.

**1.4 References**

*   V-Float `requirements.md` document (within the project repository)
*   V-Float `README.md` document (within the project repository)
*   V-Float `ROADMAP.md` document (within the project repository)
*   Floating UI Documentation: [https://floating-ui.com/](https://floating-ui.com/)
*   Vue 3 Documentation: [https://vuejs.org/](https://vuejs.org/)
*   `@floating-ui/dom` Documentation: [https://floating-ui.com/docs/computePosition](https://floating-ui.com/docs/computePosition)
*   `@floating-ui/react` Documentation: [https://floating-ui.com/docs/react](https://floating-ui.com/docs/react)

**1.5 Overview**

This SRS document is organized into three main sections:
*   **Section 1 (Introduction):** Provides the purpose, scope, definitions, references, and overview.
*   **Section 2 (Overall Description):** Describes the product perspective, features, user characteristics, operating environment, constraints, and dependencies.
*   **Section 3 (Specific Requirements):** Details the functional, non-functional, and interface requirements for V-Float.

---

**2. Overall Description**

**2.1 Product Perspective**

V-Float is a reusable component library for the Vue 3 ecosystem. It serves as a direct functional equivalent to `@floating-ui/react`, providing Vue developers with the same powerful tools for building floating UI elements. It depends critically on the `@floating-ui/dom` library for its core positioning calculations and leverages Vue 3's Composition API and reactivity system for state management and integration. It is intended to be installed as an NPM package dependency in Vue 3 projects.

**2.2 Product Features**

V-Float will offer the following high-level features:

1.  **Core Positioning:** A central `useFloating` composable to manage positioning logic based on reference/floating elements.
2.  **Middleware System:** Support for all standard Floating UI middleware (`offset`, `shift`, `flip`, `arrow`, `size`, `autoPlacement`, `hide`, `inline`) via composables or utility functions.
3.  **Interaction Handling:** A suite of composables (`useHover`, `useFocus`, `useClick`, `useDismiss`, `useListNavigation`, `useTypeahead`, `useClientPoint`, `useRole`, `useTransition`) to manage common and complex user interactions.
4.  **Interaction Aggregation:** A `useInteractions` composable to easily combine multiple interaction hooks and apply necessary props.
5.  **Helper Components:** Optional components (`FloatingArrow`, `FloatingPortal`, `FloatingFocusManager`, `FloatingOverlay`, `FloatingList`, `FloatingListItem`, `FloatingTree`, `FloatingDelayGroup`, `Composite`, `CompositeItem`) to simplify common use cases.
6.  **Accessibility Primitives:** Built-in support for ARIA attributes and keyboard navigation patterns.
7.  **Flexibility & Customization:** Highly configurable through options passed to composables and props passed to components.
8.  **Performance:** Optimized positioning updates and tree-shakable modules.

**2.3 User Classes and Characteristics**

The primary users of V-Float are:

*   **Vue 3 Developers:** Developers building web applications using the Vue 3 framework who need to implement floating UI elements like tooltips, popovers, menus, etc.
    *   **Experience:** Assumed to have a working knowledge of Vue 3, the Composition API, TypeScript (optional but recommended), HTML, CSS, and basic DOM concepts. Familiarity with ARIA concepts is beneficial for building accessible components.
    *   **Needs:** Require a reliable, flexible, and performant way to position and manage interactions for floating elements without reinventing the complex logic involved. Developers familiar with `floating-ui/react` may specifically seek a similar API experience in Vue.

**2.4 Operating Environment**

*   **Runtime:** Modern web browsers supporting ECMAScript 2018+ and the Vue 3 runtime.
*   **Development:** Node.js environment (v18+ recommended, based on typical Vite/Vue tooling requirements). A package manager like pnpm, npm, or yarn is required.
*   **Dependencies:** Requires `vue` (^3.5.13 or compatible) and `@floating-ui/dom` (^1.6.13 or compatible) as runtime dependencies.

**2.5 Design and Implementation Constraints**

*   **Core Engine:** MUST use `@floating-ui/dom` for all core positioning calculations via its `computePosition` function.
*   **Framework:** MUST be implemented using Vue 3 Composition API and reactivity system (`ref`, `reactive`, `computed`, `watch`, `onMounted`, `onUnmounted`, etc.).
*   **API Parity:** MUST strive for functional and API parity with `@floating-ui/react` (Hooks mapped to Composables, Components mapped to Components), adapting only where necessary for Vue idioms. See `requirements.md` Tables 1, 2, 3 for specific mappings.
*   **TypeScript:** MUST be written in TypeScript for type safety and improved developer experience. Generated type definitions (`.d.ts`) MUST be included in the published package.
*   **Tree-Shakability:** The library MUST be structured to allow bundlers (like Vite, Webpack) to tree-shake unused composables and middleware.
*   **Vue Refs:** MUST utilize Vue's `ref` system (Template Refs or `ref()` instances) to obtain DOM element references required by `@floating-ui/dom`. Clear documentation on ref handling is required.
*   **Build System:** MUST use Vite for development, building, and testing infrastructure (as indicated by `vite.config.ts`, `vitest.workspace.ts`).
*   **Linting/Formatting:** MUST adhere to code style and quality standards enforced by Biome (as configured in `biome.json`).
*   **Testing:** MUST include comprehensive unit tests using Vitest (covering composables and utility functions). Storybook MUST be used for component visualization and testing.
*   **Documentation:** MUST provide comprehensive documentation (using VitePress) covering installation, concepts, API reference for all composables/components, examples, and accessibility guidelines.

**2.6 Assumptions and Dependencies**

*   The Vue 3 reactivity system will function as documented and provide reliable tracking for refs and reactive objects used within composables and middleware options.
*   The `@floating-ui/dom` library API will remain relatively stable and continue to provide the necessary `computePosition` function and middleware capabilities.
*   Users have a compatible Node.js and package manager environment set up for installing and using the library.
*   Browsers targeted by users support the required CSS properties (e.g., `transform`, `position: absolute/fixed`) and JavaScript features.

---

**3. Specific Requirements**

**3.1 Functional Requirements**

This section details the specific functions the V-Float library must perform. Requirements are derived heavily from the V-Float `requirements.md` document.

**3.1.1 Core Positioning (`useFloating`)**

*   **FR-CORE-001:** The system SHALL provide a `useFloating` composable.
*   **FR-CORE-002:** `useFloating` SHALL accept an optional `options` object argument.
*   **FR-CORE-003:** The `options` object for `useFloating` SHALL support the following properties with specified defaults:
    *   `placement`: `string` (default: `'bottom'`). Must support all 12 standard Floating UI placements.
    *   `strategy`: `string` (default: `'absolute'`). Must support `'absolute'` and `'fixed'`.
    *   `middleware`: `array` (default: `[]`). Accepts an array of middleware functions/objects.
    *   `elements`: `object` (optional). With `reference` and `floating` properties accepting Vue `Ref<Element | null>`, `VirtualElement`, or direct DOM Elements.
    *   `whileElementsMounted`: `function` (optional). Accepts an `autoUpdate`-compatible function for managing position updates while elements are mounted.
    *   `open`: `Ref<boolean>` (optional). A Vue ref controlling the visibility state.
    *   `onOpenChange`: `function` (optional). A callback function invoked when the open state changes.
    *   `transform`: `boolean` (default: `true`). Whether to use CSS transforms for positioning (influences `floatingStyles`).
*   **FR-CORE-004:** `useFloating` SHALL return a reactive `context` object containing:
    *   `x`: `Ref<number | null>` (reactive x-coordinate).
    *   `y`: `Ref<number | null>` (reactive y-coordinate).
    *   `placement`: `Ref<Placement>` (reactive final placement).
    *   `strategy`: `Ref<Strategy>` (reactive positioning strategy).
    *   `middlewareData`: `Ref<MiddlewareData>` (reactive data from middleware).
    *   `isPositioned`: `Ref<boolean>` (reactive flag indicating if positioning has occurred).
    *   `floatingStyles`: `Ref<CSSProperties>` (reactive object with CSS styles for positioning).
    *   `update`: `function` (function to manually trigger a position recalculation).
    *   `refs`: `object` (containing `reference` and `floating` Vue refs, managed internally if not provided via `options.elements`).
    *   `elements`: `object` (containing reactive refs to the current DOM `reference` and `floating` elements).
*   **FR-CORE-005:** `useFloating` SHALL internally use `@floating-ui/dom`'s `computePosition` function for calculations.
*   **FR-CORE-006:** `useFloating` SHALL handle the asynchronous nature of `computePosition`.
*   **FR-CORE-007:** `useFloating` SHALL automatically update positioning when reactive dependencies in its options (e.g., `placement`, `middleware` options, `elements`) change.
*   **FR-CORE-008:** The system SHALL correctly handle logical placements (`*-start`, `*-end`) respecting LTR/RTL text direction.
*   **FR-CORE-009:** The system SHALL provide integration with `autoUpdate` via the `whileElementsMounted` option or allow manual setup using Vue lifecycle hooks (`onMounted`, `onUnmounted`).

**3.1.2 Middleware Composables/Utilities**

*   **FR-MW-001:** The system SHALL provide implementations equivalent to all standard Floating UI middleware: `offset`, `shift`, `flip`, `arrow`, `size`, `autoPlacement`, `hide`, `inline`.
*   **FR-MW-002:** Each middleware SHALL be usable by passing it as an element in the `middleware` array option of `useFloating`.
*   **FR-MW-003:** Middleware implementations SHALL accept configuration options as defined in the Floating UI documentation (e.g., `offset(10)`, `shift({ padding: 5 })`).
*   **FR-MW-004:** Middleware SHALL respect the order they are provided in the `middleware` array.
*   **FR-MW-005:** Middleware SHALL correctly handle and react to changes in reactive Vue refs or computed properties passed into their options.
*   **FR-MW-006:** The `arrow` middleware SHALL be primarily accessed via a `useArrow` composable (see FR-UTIL-002).

**3.1.3 Interaction Composables**

*   **FR-INT-001 (`useHover`):** Shall provide logic for opening/closing the floating element on hover interactions. Accepts `context` and `options` (`enabled`, `move`, `delay`). Returns props for the reference element.
*   **FR-INT-002 (`useFocus`):** Shall provide logic for opening/closing on focus/blur. Accepts `context` and `options` (`enabled`, `visibleOnly`). Returns props for reference.
*   **FR-INT-003 (`useClick`):** Shall provide logic for toggling on click. Accepts `context` and `options` (`enabled`). Returns props for reference.
*   **FR-INT-004 (`useDismiss`):** Shall provide logic for closing the floating element (outside press, Escape key, etc.). Accepts `context` and `options` (`enabled`, `escapeKey`, `referencePress`, `outsidePress`, `ancestorScroll`, `bubbles`, `capture`, `referencePressEvent`, `outsidePressEvent`). Returns props for reference and floating elements.
*   **FR-INT-005 (`useListNavigation`):** Shall enable keyboard navigation (arrow keys, Home, End) within a list in the floating element. Accepts `context` and extensive `options` (see `requirements.md` 4.2). Returns props for reference, floating, and list items (`getItemProps`).
*   **FR-INT-006 (`useTypeahead`):** Shall enable type-to-select functionality within a list. Accepts `context` and `options` (`listRef`, `activeIndex`, `onMatch`, `enabled`, etc.). Returns props for reference and floating elements.
*   **FR-INT-007 (`useTransition`):** Shall provide reactive state for CSS transitions. Implementations `useTransitionStyles` (returns `isMounted`, `styles`) and `useTransitionStatus` (returns `status`) are required. Accepts `context` and `options`.
*   **FR-INT-008 (`useClientPoint`):** Shall position the floating element based on client coordinates (e.g., mouse events). Accepts `context` and `options` (`enabled`, `axis`, `x`, `y`). Returns props for reference.
*   **FR-INT-009 (`useRole`):** Shall provide ARIA props (`role`, `id`, `aria-*`) for accessibility based on the intended role (tooltip, popover, menu, listbox, dialog). Accepts `context` and `options` (`role`, `enabled`). Returns props for reference, floating, and potentially items (`getItemProps`).
*   **FR-INT-010 (`useInteractions`):** Shall accept an array of interaction hook results. Returns aggregated prop getter functions: `getReferenceProps`, `getFloatingProps`, `getItemProps`. These getters merge event handlers and ARIA attributes from the input hooks.

**3.1.4 Utility Composables**

*   **FR-UTIL-001 (`useMergeRefs`):** Shall accept an array of Vue refs (Template Refs or function refs) and return a single function ref that assigns the element to all input refs.
*   **FR-UTIL-002 (`useArrow`):** Shall wrap the `arrow` middleware logic. Accepts `context` and an `options` object containing an `element` ref (Vue `Ref<Element | null>`). Provides reactive `arrowRef` and `arrowStyles` suitable for `<FloatingArrow>`.

**3.1.5 Core Components**

*   **FR-COMP-001 (`<FloatingArrow>`):** Shall render an SVG arrow. Accepts props: `context` (required), `width`, `height`, `tipRadius`, `fill`, `stroke`, `strokeWidth`, `staticOffset`. Must position itself based on arrow middleware data (typically via `useArrow`).
*   **FR-COMP-002 (`<FloatingFocusManager>`):** Shall manage focus trapping within the floating element. Accepts props: `context` (required), `disabled`, `initialFocus`, `returnFocus`, `modal`, `order`, `visuallyHiddenDismiss`. Must work correctly with `FloatingPortal`.
*   **FR-COMP-003 (`<FloatingPortal>`):** Shall render its slot content into a different DOM node (default `document.body`) using Vue's `<Teleport>`. Accepts props: `root`, `id`, `preserveTabOrder`.
*   **FR-COMP-004 (`<FloatingTree>`):** Shall provide context for nested floating elements. Enables interactions like nested menu closing.
    *   **FR-COMP-004a:** Associated composables `useFloatingNodeId`, `useFloatingParentNodeId`, `useFloatingTree` MUST be provided to interact with the tree context.
*   **FR-COMP-005 (`<FloatingOverlay>`):** Shall render a `div` acting as an overlay. Accepts `lockScroll` prop to prevent body scroll.
*   **FR-COMP-006 (`<FloatingList>`):** Shall act as a context provider for `useListNavigation` and `useTypeahead`. Accepts props `elementsRef` (required array ref) and `labelsRef` (optional array ref).
    *   **FR-COMP-006a:** An associated `useListItem` composable SHALL be provided for registering list items, returning `ref` and `index`.
*   **FR-COMP-007 (`<FloatingDelayGroup>`):** Shall provide context for coordinating hover delays across multiple floating elements. Accepts `delay` (required) and `timeoutMs` props.
    *   **FR-COMP-007a:** An associated `useDelayGroup` composable SHALL be provided to access the delay context.
*   **FR-COMP-008 (`<Composite>`):** Shall create a composite widget structure for keyboard navigation (e.g., toolbars). Accepts props `render`, `orientation`, `loop`, `rtl`, `cols`, `disabledIndices`, `activeIndex`, `onNavigate`, `itemSizes`, `dense`.
*   **FR-COMP-009 (`<CompositeItem>`):** Shall represent an item within a `<Composite>` component. Accepts prop `render`.

**3.1.6 Accessibility Support**

*   **FR-ACC-001:** `useRole` SHALL correctly apply ARIA roles and attributes (`aria-haspopup`, `aria-controls`, `aria-labelledby`, `aria-describedby`, etc.) based on the specified role.
*   **FR-ACC-002:** `useListNavigation` SHALL implement WAI-ARIA patterns for navigating list-like structures (e.g., menu, listbox) using the keyboard.
*   **FR-ACC-003:** `FloatingFocusManager` SHALL correctly trap focus within modal floating elements and manage focus return according to WAI-ARIA practices.
*   **FR-ACC-004:** Documentation SHALL guide developers on using semantic HTML and V-Float primitives to build accessible components.

**3.1.7 Virtual Element Support**

*   **FR-VIRT-001:** `useFloating` SHALL accept a `VirtualElement` object (implementing `getBoundingClientRect` and optionally `contextElement`) for the `reference` element option.
*   **FR-VIRT-002:** `useClientPoint` SHALL effectively use a virtual element internally based on event coordinates to position the floating element.

**3.1.8 Overflow Detection**

*   **FR-OVFL-001:** The system SHALL provide a `detectOverflow` utility function, mirroring the one in `@floating-ui/dom`, allowing programmatic checks for element overflow relative to clipping boundaries.

**3.2 Non-Functional Requirements**

*   **NFR-PERF-001 (Performance):** Positioning updates triggered by `computePosition` or `autoUpdate` should be efficient, minimizing layout thrashing. The overhead introduced by Vue reactivity wrappers should be minimal.
*   **NFR-USE-001 (Usability):** The API (composables, components) shall be intuitive and idiomatic for Vue 3 developers. Documentation shall be comprehensive, clear, and include practical examples. API should closely mirror `@floating-ui/react` where feasible.
*   **NFR-REL-001 (Reliability):** Positioning calculations shall be accurate across supported browsers. Interactions shall function consistently. Edge cases (e.g., element removal, rapid state changes) shall be handled gracefully.
*   **NFR-MAIN-001 (Maintainability):** Source code shall be well-structured, modular, and adhere to the coding standards defined by Biome. TypeScript shall be used for static typing. Code shall be adequately commented where necessary.
*   **NFR-PORT-001 (Portability):** The library shall function correctly in all modern evergreen browsers that support Vue 3.
*   **NFR-ACC-001 (Accessibility):** The library primitives MUST enable developers to build components compliant with WCAG 2.1 AA standards.
*   **NFR-TREE-001 (Tree-Shakability):** The library MUST be built in a way that allows modern bundlers to eliminate unused composables and middleware from the final application bundle. ESM builds must be provided.
*   **NFR-TEST-001 (Testability):** The library shall have high unit test coverage (>80% target) using Vitest. Key components and interactions should be verifiable using Storybook stories.

**3.3 Interface Requirements**

**3.3.1 User Interfaces**

*   The library itself does not provide an end-user UI, but enables the creation of UIs.
*   The `<FloatingArrow>` component renders an SVG element.
*   The documentation site (built with VitePress) provides the primary interface for developers learning the library.
*   The Storybook instance provides an interface for developers to interactively explore components.

**3.3.2 Software Interfaces**

*   **Consumed APIs:**
    *   Vue 3 API (Composition API, Reactivity, Teleport, etc.) - Version ^3.5.13 or compatible.
    *   `@floating-ui/dom` API (`computePosition`, middleware structure) - Version ^1.6.13 or compatible.
    *   `@vueuse/core` (potentially for utilities like `useEventListener`, etc.) - Version ^13.0.0 or compatible.
*   **Provided API:**
    *   Set of exported Vue 3 composables (`useFloating`, `useHover`, etc.).
    *   Set of exported Vue 3 components (`<FloatingArrow>`, `<FloatingPortal>`, etc.).
    *   Type definitions (`.d.ts`) for TypeScript users.

**3.3.3 Hardware Interfaces**

*   None. Operates within standard web browser environments.

**3.3.4 Communications Interfaces**

*   None required for core functionality.

---

**4. Appendices** (Optional)

**4.1 Glossary**

*(Definitions provided in Section 1.3 cover the essential terms)*

**4.2 Analysis Models**

*(Could include diagrams showing data flow between composables, components, and `@floating-ui/dom`, or state diagrams for interaction hooks if deemed necessary during detailed design).*

---