# MAX++ Rust migration

## Current architecture

MAX++ is a Tauri 2 application. The native side is Rust and the presentation
layer is Svelte 5 running in the platform WebView.

The existing native layer already owns the MAX protocol client through
`rumax`, authentication, message and chat operations, local stores, media,
notifications, cryptography, and the Tauri command bridge. These operations
must remain native. Do not duplicate protocol requests, persistence rules,
cryptographic operations, or account state in Svelte.

## Migration boundary

- **Svelte:** render UI, collect input, manage short-lived visual state, and
  invoke typed Tauri commands.
- **Rust commands:** validate user intent, coordinate domain operations, and
  return serializable results.
- **Rust services:** own authentication/session state, chats, messages,
  contacts, media, local persistence, notifications, and cryptography.
- **rumax:** isolate MAX protocol transport and API models.

## Rules for new work

1. Put new product/business rules in Rust, not Svelte components.
2. Keep Tauri command arguments and results serializable with Serde.
3. Return structured errors; do not silently swallow failures.
4. Never log authentication tokens, private message content, or encryption keys.
5. Keep UI-only animation and presentation behavior in Svelte.
6. Add Rust unit tests for domain rules and integration tests for command
   boundaries where practical.

## First migration increment

- Added a Rust-owned application metadata command, `app_core_info`.
- Registered it in the Tauri invoke handler.
- Branded the desktop application and package metadata as MAX++.
- Kept the existing Android application identifier unchanged for now because
  the generated Android project still uses the original Kotlin package. A
  package-ID migration must update the Android namespace, application ID,
  Kotlin package declarations, manifest integrations, and push configuration
  together.

## Next increments

1. Inventory Svelte modules that currently perform domain decisions or direct
   network/storage work.
2. Move one vertical slice at a time behind Rust commands and add tests.
3. Keep the Svelte UI behavior stable while swapping its implementation.
4. Add CI checks for Rust formatting, tests, and supported platform builds.
5. Only then migrate the Android application ID and release signing identity.
